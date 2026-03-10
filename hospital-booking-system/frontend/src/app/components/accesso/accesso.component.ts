import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-accesso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accesso.component.html',
  styleUrl: './accesso.component.scss'
})
export class AccessoComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    console.log('Tentativo login con:', this.credentials);
    
    this.authService.accesso(this.credentials).subscribe({
      next: (response) => {
        console.log('Login riuscito:', response);
        alert('Login effettuato con successo!');
        this.router.navigate(['/prenota']);
      },
      error: (error) => {
        console.error('Errore login:', error);
        alert(error.error?.errore || 'Email o password errati');
      }
    });
  }
}