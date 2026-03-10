import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RichiestaRegistrazione } from '../../models/utente.model';

@Component({
  selector: 'app-registrazione',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registrazione.component.html',
  styleUrl: './registrazione.component.scss'
})
export class RegistrazioneComponent {
  utente: RichiestaRegistrazione = {
    nome: '',
    email: '',
    password: '',
    codiceFiscale: '',
    telefono: ''
  };
  confermaPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.utente.password !== this.confermaPassword) {
      alert('Le password non coincidono');
      return;
    }

    this.authService.registrazione(this.utente).subscribe({
      next: (response) => {
        alert('Registrazione completata con successo!');
        this.router.navigate(['/prenota']);
      },
      error: (error) => {
        console.error('Errore registrazione', error);
        alert(error.error?.errore || 'Errore durante la registrazione');
      }
    });
  }
}