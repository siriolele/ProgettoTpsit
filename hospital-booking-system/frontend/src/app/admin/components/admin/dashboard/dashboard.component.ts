import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrenotazioneService } from '../../../../services/prenotazione.service';
import { Prenotazione } from '../../../../models/prenotazione.model';
import { Utente } from '../../../../models/utente.model';

// Interfaccia che forza utente come oggetto (non stringa)
interface PrenotazioneConUtente extends Omit<Prenotazione, 'utente'> {
  utente: Utente;  // Garantisce che utente sia un oggetto completo
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  prenotazioni: PrenotazioneConUtente[] = [];
  prenotazioniFiltrate: PrenotazioneConUtente[] = [];
  filtro: string = 'tutte';
  
  statistiche = {
    totale: 0,
    confermate: 0,
    in_attesa: 0,
    cancellate: 0
  };

  prenotazioneInModifica: Partial<Prenotazione> = {};
  fasceOrarie: string[] = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  private modal: any;

  constructor(private prenotazioneService: PrenotazioneService) {}

  ngOnInit(): void {
    this.caricaPrenotazioni();
  }

  caricaPrenotazioni(): void {
    this.prenotazioneService.getTuttePrenotazioni().subscribe({
      next: (data) => {
        // Filtra solo le prenotazioni dove utente è un oggetto (non stringa)
        this.prenotazioni = data
          .filter(p => typeof p.utente !== 'string')  // Solo quelle con oggetto Utente
          .map(p => p as PrenotazioneConUtente);      // Cast al tipo corretto
          
        this.prenotazioniFiltrate = [...this.prenotazioni];
        this.calcolaStatistiche();
      },
      error: (error) => {
        console.error('Errore caricamento prenotazioni', error);
      }
    });
  }

  calcolaStatistiche(): void {
    this.statistiche = {
      totale: this.prenotazioni.length,
      confermate: this.prenotazioni.filter(p => p.stato === 'confermata').length,
      in_attesa: this.prenotazioni.filter(p => p.stato === 'in_attesa').length,
      cancellate: this.prenotazioni.filter(p => p.stato === 'cancellata').length
    };
  }

  filtra(tipo: string): void {
    this.filtro = tipo;
    if (tipo === 'tutte') {
      this.prenotazioniFiltrate = this.prenotazioni;
    } else if (tipo === 'pagate') {
      this.prenotazioniFiltrate = this.prenotazioni.filter(p => p.statoPagamento === 'pagato');
    } else {
      this.prenotazioniFiltrate = this.prenotazioni.filter(p => p.stato === tipo);
    }
  }

  modificaPrenotazione(p: PrenotazioneConUtente): void {
    this.prenotazioneInModifica = { 
      _id: p._id,
      data: p.data,
      ora: p.ora,
      stato: p.stato,
      statoPagamento: p.statoPagamento
    };
    
    // Inizializza il modal (se usi Bootstrap)
    const modalElement = document.getElementById('modificaModal');
    if (modalElement) {
      // @ts-ignore - Bootstrap might not be typed
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  salvaModifiche(): void {
    if (this.prenotazioneInModifica._id) {
      this.prenotazioneService.aggiornaPrenotazione(
        this.prenotazioneInModifica._id, 
        this.prenotazioneInModifica
      ).subscribe({
        next: () => {
          if (this.modal) {
            this.modal.hide();
          }
          alert('Prenotazione aggiornata con successo');
          this.caricaPrenotazioni();
        },
        error: (error) => {
          console.error('Errore aggiornamento', error);
          alert('Errore durante l\'aggiornamento');
        }
      });
    }
  }

  visualizzaDettagli(p: PrenotazioneConUtente): void {
    alert(`
      Dettagli prenotazione:
      ----------------------------------------
      👤 PAZIENTE:
      Nome: ${p.utente.nome}
      Email: ${p.utente.email}
      Telefono: ${p.utente.telefono}
      Codice Fiscale: ${p.utente.codiceFiscale}
      
      🏥 PRENOTAZIONE:
      Reparto: ${p.reparto}
      Medico: ${p.medico}
      Data: ${new Date(p.data).toLocaleDateString()}
      Ora: ${p.ora}
      
      📝 NOTE: ${p.note || 'Nessuna nota'}
      
      📊 STATO:
      Prenotazione: ${this.getStatoTesto(p.stato)}
      Pagamento: ${p.statoPagamento === 'pagato' ? '✅ Pagato' : '⏳ In attesa'}
    `);
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
}