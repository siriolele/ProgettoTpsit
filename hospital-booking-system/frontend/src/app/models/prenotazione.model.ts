import { Utente } from './utente.model';
export interface Prenotazione {
  _id: string;
  utente: Utente | string;
  reparto: 'Cardiologia' | 'Oculistica' | 'Ortopedia' | 'Pediatria' | 'Chirurgia';
  medico: string;
  data: Date;
  ora: string;
  stato: 'in_attesa' | 'confermata' | 'cancellata' | 'pagata' | 'riprogrammata';
  statoPagamento: 'in_attesa' | 'pagato' | 'rimborsato';
  metodoPagamento?: 'contanti' | 'carta' | 'bonifico';
  note?: string;
  dataCreazione: Date;
  ultimaModificaDi?: string;
}

export interface CreaPrenotazioneRequest {
  reparto: string;
  medico: string;
  data: Date;
  ora: string;
  note?: string;
}