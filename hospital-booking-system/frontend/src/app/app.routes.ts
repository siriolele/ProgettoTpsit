import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { 
    path: 'accesso', 
    loadComponent: () => import('./components/accesso/accesso.component').then(m => m.AccessoComponent) 
  },
  { 
    path: 'registrazione', 
    loadComponent: () => import('./components/registrazione/registrazione.component').then(m => m.RegistrazioneComponent) 
  },
  { 
    path: 'prenota', 
    loadComponent: () => import('./components/prenotazione/prenotazione.component').then(m => m.PrenotazioneComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'mie-prenotazioni', 
    loadComponent: () => import('./components/mie-prenotazioni/mie-prenotazioni.component').then(m => m.MiePrenotazioniComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [adminGuard]
  },
  { 
  path: 'pagamento/:id', 
  loadComponent: () => import('./components/pagamento/pagamento.component').then(m => m.PagamentoComponent),
  canActivate: [authGuard]
},
  { path: '', redirectTo: '/prenota', pathMatch: 'full' },
  { path: '**', redirectTo: '/prenota' }
];