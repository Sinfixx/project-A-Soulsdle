import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'game',
    loadComponent: () => import('./features/game/game').then((m) => m.Game),
    canActivate: [authGuard],
  },
  {
    path: 'boss',
    loadComponent: () => import('./features/boss/boss-list/boss-list').then((m) => m.BossList),
    canActivate: [authGuard],
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/stats/stats/stats').then((m) => m.Stats),
    canActivate: [authGuard],
  },
  {
    path: 'player/:id',
    loadComponent: () => import('./features/stats/player/player').then((m) => m.Player),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'game',
  },
];
