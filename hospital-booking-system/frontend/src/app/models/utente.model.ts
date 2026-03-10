export interface Utente {
  _id: string;
  nome: string;
  email: string;
  ruolo: 'utente' | 'amministratore';
  codiceFiscale: string;
  telefono: string;
  dataRegistrazione: Date;
}

export interface RichiestaAccesso {
  email: string;
  password: string;
}

export interface RichiestaRegistrazione {
  nome: string;
  email: string;
  password: string;
  codiceFiscale: string;
  telefono: string;
}

export interface RispostaAuth {
  utente: Utente;
  token: string;
}