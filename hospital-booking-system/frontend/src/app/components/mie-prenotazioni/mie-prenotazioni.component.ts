import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PrenotazioneService } from '../../services/prenotazione.service';
import { Prenotazione } from '../../models/prenotazione.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-mie-prenotazioni',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mie-prenotazioni.component.html',
  styleUrl: './mie-prenotazioni.component.scss'
})
export class MiePrenotazioniComponent implements OnInit {
  prenotazioni: Prenotazione[] = [];

  constructor(
  private prenotazioneService: PrenotazioneService,
  private router: Router
) {}


  ngOnInit(): void {
    this.caricaPrenotazioni();
  }

  caricaPrenotazioni(): void {
    this.prenotazioneService.getMiePrenotazioni().subscribe({
      next: (data) => {
        this.prenotazioni = data;
      },
      error: (error) => {
        console.error('Errore caricamento prenotazioni', error);
      }
    });
  }

  cancellaPrenotazione(id: string): void {
    if (confirm('Sei sicuro di voler cancellare questa prenotazione?')) {
      this.prenotazioneService.aggiornaPrenotazione(id, { stato: 'cancellata' }).subscribe({
        next: () => {
          alert('Prenotazione cancellata con successo');
          this.caricaPrenotazioni();
        },
        error: (error) => {
          console.error('Errore cancellazione', error);
          alert('Errore durante la cancellazione');
        }
      });
    }
  }

  pagaPrenotazione(id: string): void {
  this.router.navigate(['/pagamento', id]);
}
  getClasseStato(stato: string): string {
    const classi: { [key: string]: string } = {
      'in_attesa': 'badge bg-warning',
      'confermata': 'badge bg-success',
      'cancellata': 'badge bg-danger',
      'pagata': 'badge bg-info',
      'riprogrammata': 'badge bg-primary'
    };
    return classi[stato] || 'badge bg-secondary';
  }

  getStatoTesto(stato: string): string {
    const testi: { [key: string]: string } = {
      'in_attesa': 'In attesa',
      'confermata': 'Confermata',
      'cancellata': 'Cancellata',
      'pagata': 'Pagata',
      'riprogrammata': 'Riprogrammata'
    };
    return testi[stato] || stato;
  }

  getClassePagamento(stato: string): string {
    return stato === 'pagato' ? 'badge bg-success' : 'badge bg-warning';
  }

  getPagamentoTesto(stato: string): string {
    return stato === 'pagato' ? 'Pagato' : 'Da pagare';
  }
}