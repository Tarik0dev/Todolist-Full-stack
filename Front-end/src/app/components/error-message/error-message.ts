import { Component, signal } from '@angular/core';
import { toast } from 'ngx-sonner';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';

@Component({
  selector: 'app-error-message',
  imports: [HlmToasterImports],
  templateUrl: './error-message.html',
  styleUrl: './error-message.css',
})
export class ErrorMessage {
  message = signal<string>('');
  display = signal<boolean>(false);

  showToast() {
    toast('Erreur', {
      description: `${this.message}`,
      action: {
        label: 'Fermer',
        onClick: () => console.log('Fermer'),
      },
    });
  }
}
