import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Achievement {
  id: string;
  nom: string;
  description: string;
  icone: string;
  categorie: 'Progression' | 'Compétence' | 'Collection' | 'Spécial';
  rarete: 'Commun' | 'Rare' | 'Épique' | 'Légendaire';
  condition: {
    type: string;
    valeur: number;
    jeu?: string;
    tentativesMax?: number;
  };
  ordre: number;
  dateDeblocage?: string;
  progression?: number;
  progressionActuelle?: number;
  progressionRequise?: number;
  totalDeblocages?: number;
  pourcentage?: number;
}

export interface AchievementsResponse {
  unlocked: Achievement[];
  inProgress: Achievement[];
  totalUnlocked: number;
  totalAchievements: number;
}

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private apiUrl = 'http://localhost:3000';

  // BehaviorSubject pour notifier les composants des nouveaux achievements
  private newAchievementsSubject = new BehaviorSubject<Achievement[]>([]);
  public newAchievements$ = this.newAchievementsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les achievements avec statistiques globales
   */
  getAllAchievements(): Observable<{ achievements: Achievement[] }> {
    return this.http.get<{ achievements: Achievement[] }>(`${this.apiUrl}/achievements`);
  }

  /**
   * Récupère les achievements du joueur connecté
   */
  getMyAchievements(): Observable<AchievementsResponse> {
    return this.http.get<AchievementsResponse>(`${this.apiUrl}/achievements/me`);
  }

  /**
   * Récupère les détails d'un achievement spécifique
   */
  getAchievementDetails(id: string): Observable<Achievement> {
    return this.http.get<Achievement>(`${this.apiUrl}/achievements/${id}`);
  }

  /**
   * Vérifie et débloque les achievements pour le joueur connecté
   */
  checkAllAchievements(): Observable<{ newAchievements: Achievement[]; count: number }> {
    return this.http
      .post<{
        newAchievements: Achievement[];
        count: number;
      }>(`${this.apiUrl}/achievements/check-all`, {})
      .pipe(
        tap((response) => {
          if (response.newAchievements.length > 0) {
            this.newAchievementsSubject.next(response.newAchievements);
          }
        }),
      );
  }

  /**
   * Notifie les nouveaux achievements (appelé après une victoire)
   */
  notifyNewAchievements(achievements: Achievement[]) {
    if (achievements && achievements.length > 0) {
      this.newAchievementsSubject.next(achievements);
    }
  }

  /**
   * Efface les notifications de nouveaux achievements
   */
  clearNewAchievements() {
    this.newAchievementsSubject.next([]);
  }
}
