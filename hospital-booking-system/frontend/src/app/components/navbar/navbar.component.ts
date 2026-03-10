import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.èAutenticato();
  }

  isAdmin(): boolean {
    return this.authService.èAdmin();
  }

  userName(): string {
    const utente = this.authService['utenteCorrenteSubject'].value;
    return utente?.nome || 'Utente';
  }

  logout(): void {
    this.authService.esci();
  }
}