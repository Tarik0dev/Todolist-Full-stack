import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ForgotPasswordRequest } from '../models/request/forgotPasswordRequest.interface';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  private api = inject(AuthenticationService);
  private router = inject(Router);

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  emailSent: boolean = false;
  errorEmail: boolean = false;

  onSubmit() {
    if (this.forgotForm.valid) {
      const forgotForm = this.forgotForm.value;
      const email: ForgotPasswordRequest = {
        email: forgotForm.email || '',
      };

      this.api.forgotPassword(email).subscribe({
        next: (response) => {
          this.emailSent = true;
          toast.success('Un email a été envoyé à votre adresse');
          this.router.navigate(['']);
        },

        error: (error) => {
          toast.error('Le serveur est actuellement indisponible, veuillez réessayer ultérieuement');
          this.errorEmail = true;
        },
      });
    }
  }
}
