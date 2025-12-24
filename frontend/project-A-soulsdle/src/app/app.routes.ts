import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full',
  },
  {
    path: 'game',
    loadComponent: () => import('./features/game/game').then((m) => m.Game),
  },
  {
    path: 'boss',
    loadComponent: () => import('./features/boss/boss-list/boss-list').then((m) => m.BossList),
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/stats/stats/stats').then((m) => m.Stats),
  },
  {
    path: 'player/:id',
    loadComponent: () => import('./features/stats/player/player').then((m) => m.Player),
  },
  {
    path: '**',
    redirectTo: 'game',
  },
];
