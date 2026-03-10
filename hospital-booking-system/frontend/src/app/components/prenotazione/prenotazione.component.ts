import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrenotazioneService } from '../../services/prenotazione.service';
import { CreaPrenotazioneRequest } from '../../models/prenotazione.model';


@Component({
  selector: 'app-prenotazione',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prenotazione.component.html',
  styleUrl: './prenotazione.component.scss'
})
export class PrenotazioneComponent implements OnInit {
  prenotazione: CreaPrenotazioneRequest = {
    reparto: '',
    medico: '',
    data: new Date(),
    ora: '',
    note: ''
  };
  
  medici: string[] = [];
  fasceDisponibili: string[] = [];
  dataMinima = new Date().toISOString().split('T')[0];

  private mediciPerReparto: { [key: string]: string[] } = {
    'Cardiologia': ['Dr. Rossi Mario', 'Dr. Bianchi Luca', 'Dr. Verdi Anna'],
    'Oculistica': ['Dr. Ferrari Marco', 'Dr. Esposito Giulia'],
    'Ortopedia': ['Dr. Romano Paolo', 'Dr. Gallo Serena'],
    'Pediatria': ['Dr. Conti Laura', 'Dr. De Luca Roberto'],
    'Chirurgia': ['Dr. Marchetti Fabio', 'Dr. Serra Chiara']
  };

  constructor(
    private prenotazioneService: PrenotazioneService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Imposta data minima a oggi
    this.prenotazione.data = new Date();
  }

  onRepartoChange(): void {
    this.medici = this.mediciPerReparto[this.prenotazione.reparto] || [];
    this.prenotazione.medico = '';
    this.prenotazione.ora = '';
    this.fasceDisponibili = [];
    
    if (this.prenotazione.data) {
      this.caricaFasceDisponibili();
    }
  }

  onDataChange(): void {
    this.prenotazione.ora = '';
    if (this.prenotazione.reparto && this.prenotazione.data) {
      this.caricaFasceDisponibili();
    }
  }

  caricaFasceDisponibili(): void {
    this.prenotazioneService.getFasceDisponibili(
      this.prenotazione.data, 
      this.prenotazione.reparto
    ).subscribe({
      next: (fasce) => {
        this.fasceDisponibili = fasce;
      },
      error: (error) => {
        console.error('Errore caricamento fasce', error);
        alert('Errore nel caricamento delle fasce orarie');
      }
    });
  }

  onSubmit(): void {
    this.prenotazioneService.creaPrenotazione(this.prenotazione).subscribe({
      next: (response) => {
        alert('Prenotazione creata con successo! Procedi al pagamento.');
        // Simula pagamento
        this.processaPagamento(response._id);
      },
      error: (error) => {
        console.error('Errore prenotazione', error);
        alert(error.error?.errore || 'Errore durante la prenotazione');
      }
    });
  }

  private processaPagamento(id: string): void {
    // Per ora simuliamo pagamento con carta
    this.prenotazioneService.processaPagamento(id, 'carta').subscribe({
      next: () => {
        alert('Pagamento effettuato con successo!');
        this.router.navigate(['/mie-prenotazioni']);
      },
      error: (error) => {
        console.error('Errore pagamento', error);
        alert('Errore nel pagamento');
      }
    });
  }
}