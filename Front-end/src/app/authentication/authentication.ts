import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { SignInRequestInterface } from '../models/request/authenticationRequest.interface';
import { SignInResponseInterface } from '../models/response/authenticationResponse.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-authentication',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  authForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    const authValue = this.authForm.value;
    const credentials: SignInRequestInterface = {
      email: authValue.email || '',
      password: authValue.password || '',
    };

    this.authenticationService.signIn(credentials).subscribe({
      next: (response: SignInResponseInterface) => {
        toast.success('Vous êtes bien connectés !');
        localStorage.setItem('token', response.user.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        toast.error("L'identifiant et/ou le mot de passe sont incorrects");
      },
    });
  }
}
