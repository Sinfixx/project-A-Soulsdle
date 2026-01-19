import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, JoueurProfile } from '../../../services/auth';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

interface Partie {
  id: string;
  joueurId: string;
  bossSecret: string;
  tentatives: number;
  dateDebut: string;
  dateFin?: string;
}

interface StatistiquesJoueur {
  totalParties: number;
  moyenneTentatives: number;
  dernierePartie: Partie | null;
  historique: Partie[];
}

@Component({
  selector: 'app-player',
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player implements OnInit, OnDestroy {
  currentUser: JoueurProfile | null = null;
  stats: StatistiquesJoueur | null = null;
  loading = true;
  error: string | null = null;
  private statsLoaded = false; // Flag pour éviter les multiples chargements

  private apiUrl = 'http://localhost:3000';
  private userSubscription?: Subscription;

  constructor(
    private authService: Auth,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadPlayerData();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadPlayerData() {
    this.loading = true;
    this.error = null;

    // Récupérer le profil utilisateur (une seule fois)
    this.userSubscription = this.authService.currentUser$.subscribe({
      next: (user) => {
        console.log('User received:', user);
        this.currentUser = user;
        if (user && !this.statsLoaded) {
          this.statsLoaded = true; // Marquer comme chargé pour éviter les multiples appels
          this.loadPlayerStats(user.id);
        } else if (!user) {
          console.log('No user found');
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil:', err);
        this.error = 'Erreur lors du chargement du profil';
        this.loading = false;
      },
    });
  }

  loadPlayerStats(joueurId: string) {
    console.log('Loading stats for joueur:', joueurId);
    console.log('API URL:', `${this.apiUrl}/parties?joueurId=${joueurId}&limit=10`);

    // Récupérer l'historique des parties du joueur
    this.http
      .get<{ parties: Partie[] }>(`${this.apiUrl}/parties?joueurId=${joueurId}&limit=10`)
      .subscribe({
        next: (response) => {
          console.log('Parties received:', response);
          const parties = response.parties || [];
          const moyenneTentatives =
            parties.length > 0
              ? parties.reduce((sum, p) => sum + p.tentatives, 0) / parties.length
              : 0;

          this.stats = {
            totalParties: parties.length,
            moyenneTentatives: Math.round(moyenneTentatives * 10) / 10,
            dernierePartie: parties.length > 0 ? parties[0] : null,
            historique: parties.slice(0, 5),
          };
          this.loading = false;
          console.log('Stats loaded successfully, loading set to false');
          this.cdr.detectChanges(); // Forcer la détection de changement
        },
        error: (err) => {
          console.error('Erreur lors du chargement des statistiques:', err);
          console.error('Error status:', err.status);
          console.error('Error message:', err.message);
          console.error('Error details:', err.error);

          // Afficher l'erreur à l'utilisateur
          this.error = `Erreur ${err.status}: ${err.error?.error || err.message || 'Impossible de charger les statistiques'}`;

          // Initialiser avec des stats vides en cas d'erreur
          this.stats = {
            totalParties: 0,
            moyenneTentatives: 0,
            dernierePartie: null,
            historique: [],
          };
          this.loading = false;
          console.log('Error handled, loading set to false');
          this.cdr.detectChanges(); // Forcer la détection de changement
        },
      });
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Jamais';

    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStreakIcon(streak: number): string {
    if (streak >= 10) return '🔥';
    if (streak >= 5) return '⚡';
    if (streak >= 3) return '✨';
    return '📊';
  }
}
