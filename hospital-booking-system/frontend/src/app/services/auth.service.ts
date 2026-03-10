import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RispostaAuth, RichiestaAccesso, RichiestaRegistrazione, Utente } from '../models/utente.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private utenteCorrenteSubject = new BehaviorSubject<Utente | null>(null);
  public utenteCorrente$ = this.utenteCorrenteSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.caricaUtenteDaStorage();
  }

  private caricaUtenteDaStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const utenteSalvato = localStorage.getItem('utenteCorrente');
      if (utenteSalvato) {
        this.utenteCorrenteSubject.next(JSON.parse(utenteSalvato));
      }
    }
  }

  accesso(credenziali: RichiestaAccesso): Observable<RispostaAuth> {
    return this.http.post<RispostaAuth>(`${this.apiUrl}/accesso`, credenziali)
      .pipe(tap(risposta => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', risposta.token);
          localStorage.setItem('utenteCorrente', JSON.stringify(risposta.utente));
        }
        this.utenteCorrenteSubject.next(risposta.utente);
      }));
  }

  registrazione(dati: RichiestaRegistrazione): Observable<RispostaAuth> {
    return this.http.post<RispostaAuth>(`${this.apiUrl}/registrazione`, dati)
      .pipe(tap(risposta => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', risposta.token);
          localStorage.setItem('utenteCorrente', JSON.stringify(risposta.utente));
        }
        this.utenteCorrenteSubject.next(risposta.utente);
      }));
  }

  esci(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('utenteCorrente');
    }
    this.utenteCorrenteSubject.next(null);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  èAutenticato(): boolean {
    return !!this.getToken();
  }

  èAdmin(): boolean {
    const utente = this.utenteCorrenteSubject.value;
    return utente?.ruolo === 'amministratore';
  }
}