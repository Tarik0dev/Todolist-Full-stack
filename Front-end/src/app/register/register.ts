import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { RegisterRequestInterface } from '../models/request/authenticationRequest.interface';
import { RegisterResponseInterface } from '../models/response/authenticationResponse.interface';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterForm implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    ]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  passwordsMatch(): boolean {

  
    return (
      this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value
    );
   
  }



  onSubmit() {
    
    const passwordsOk = this.passwordsMatch();
    if (!passwordsOk){
      toast.error('Les deux mots de passe ne sont pas identiques.')
    }

    if (this.registerForm.valid && passwordsOk) {
      const valeurs = this.registerForm.value;

      const formValues: RegisterRequestInterface = {
        firstName: valeurs.firstName || '',
        lastName: valeurs.lastName || '',
        email: valeurs.email || '',
        password: valeurs.password || '',
      };

      this.authenticationService.register(formValues).subscribe({
        next: (response: RegisterResponseInterface) => {
          toast.success(response.message);

          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          const errorBody = error.error as RegisterResponseInterface
          toast.error(errorBody.message);
        },
      });
    } else {
      console.log('Erreur formulaire');
      this.registerForm.markAllAsTouched();
    }
  }
}
