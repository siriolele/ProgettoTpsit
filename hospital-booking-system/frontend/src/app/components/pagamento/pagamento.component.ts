import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrenotazioneService } from '../../services/prenotazione.service';
import { Prenotazione } from '../../models/prenotazione.model';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagamento.component.html',
  styleUrl: './pagamento.component.scss'
})
export class PagamentoComponent implements OnInit {
  prenotazioneId: string = '';
  prenotazione: Prenotazione | null = null;
  metodoPagamento: string = 'carta';
  caricamento: boolean = false;
  pagamentoCompletato: boolean = false;

  // Dati fittizi per la carta
  carta = {
    numero: '',
    intestatario: '',
    scadenza: '',
    cvv: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prenotazioneService: PrenotazioneService
  ) {}

  ngOnInit(): void {
    this.prenotazioneId = this.route.snapshot.paramMap.get('id') || '';
    if (this.prenotazioneId) {
      this.caricaPrenotazione();
    }
  }

  caricaPrenotazione(): void {
    // Recupera i dettagli della prenotazione
    this.prenotazioneService.getMiePrenotazioni().subscribe({
      next: (prenotazioni) => {
        this.prenotazione = prenotazioni.find(p => p._id === this.prenotazioneId) || null;
        if (!this.prenotazione) {
          alert('Prenotazione non trovata');
          this.router.navigate(['/mie-prenotazioni']);
        }
      },
      error: (error) => {
        console.error('Errore caricamento prenotazione:', error);
      }
    });
  }

  // Auto-compila
  compilaDatiTest(): void {
    this.carta = {
      numero: '4111 1111 1111 1111',
      intestatario: 'Mario Rossi',
      scadenza: '12/25',
      cvv: '123'
    };
  }

  processaPagamento(): void {
    this.caricamento = true;

    
    setTimeout(() => {
      this.prenotazioneService.processaPagamento(this.prenotazioneId, this.metodoPagamento)
        .subscribe({
          next: () => {
            this.caricamento = false;
            this.pagamentoCompletato = true;
          },
          error: (error) => {
            this.caricamento = false;
            console.error('Errore pagamento:', error);
            alert('Errore durante il pagamento. Riprova.');
          }
        });
    }, 2000);
  }

  tornaAllePrenotazioni(): void {
    this.router.navigate(['/mie-prenotazioni']);
  }

  getImporto(): number {
    return 50.00;
  }
}