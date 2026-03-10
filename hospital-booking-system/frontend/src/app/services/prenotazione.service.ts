import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prenotazione, CreaPrenotazioneRequest } from '../models/prenotazione.model';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioneService {
  private apiUrl = 'http://localhost:5000/api/prenotazioni';

  constructor(private http: HttpClient) {}

  getFasceDisponibili(data: Date, reparto: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/fasce-disponibili`, {
      params: {
        data: data.toISOString().split('T')[0],
        reparto
      }
    });
  }

  controllaDisponibilita(data: Date, reparto: string, ora: string): Observable<{ disponibile: boolean }> {
    return this.http.get<{ disponibile: boolean }>(`${this.apiUrl}/controlla-disponibilita`, {
      params: {
        data: data.toISOString().split('T')[0],
        reparto,
        ora
      }
    });
  }

  creaPrenotazione(dati: CreaPrenotazioneRequest): Observable<Prenotazione> {
    return this.http.post<Prenotazione>(this.apiUrl, dati);
  }

  getMiePrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.apiUrl}/mie-prenotazioni`);
  }

  getTuttePrenotazioni(): Observable<Prenotazione[]> {
    return this.http.get<Prenotazione[]>(`${this.apiUrl}/tutte`);
  }

  aggiornaPrenotazione(id: string, dati: Partial<Prenotazione>): Observable<Prenotazione> {
    const url = this.èAdmin() ? `${this.apiUrl}/${id}/admin` : `${this.apiUrl}/${id}`;
    return this.http.put<Prenotazione>(url, dati);
  }

  processaPagamento(id: string, metodoPagamento: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/pagamento`, { metodoPagamento });
  }

  private èAdmin(): boolean {
    const utente = JSON.parse(localStorage.getItem('utenteCorrente') || '{}');
    return utente.ruolo === 'amministratore';
  }
}