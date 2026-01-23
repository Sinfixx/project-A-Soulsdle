import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AchievementService,
  Achievement,
  AchievementsResponse,
} from '../../../services/achievement';

@Component({
  selector: 'app-achievement',
  imports: [CommonModule, FormsModule],
  templateUrl: './achievement.html',
  styleUrl: './achievement.css',
})
export class AchievementComponent implements OnInit {
  achievements: AchievementsResponse | null = null;
  loading = true;
  error: string | null = null;

  // Pour les filtres
  selectedCategory: string = 'all';
  selectedRarity: string = 'all';

  constructor(
    private achievementService: AchievementService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadAchievements();
  }

  loadAchievements() {
    this.loading = true;
    this.error = null;

    this.achievementService.getMyAchievements().subscribe({
      next: (data) => {
        this.achievements = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement achievements:', err);
        this.error = 'Erreur lors du chargement des achievements';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Filtre les achievements débloqués
   */
  getFilteredUnlocked(): Achievement[] {
    if (!this.achievements) return [];
    return this.filterAchievements(this.achievements.unlocked);
  }

  /**
   * Filtre les achievements en cours
   */
  getFilteredInProgress(): Achievement[] {
    if (!this.achievements) return [];
    return this.filterAchievements(this.achievements.inProgress);
  }

  /**
   * Applique les filtres de catégorie et rareté
   */
  private filterAchievements(list: Achievement[]): Achievement[] {
    return list.filter((achievement) => {
      const categoryMatch =
        this.selectedCategory === 'all' || achievement.categorie === this.selectedCategory;
      const rarityMatch =
        this.selectedRarity === 'all' || achievement.rarete === this.selectedRarity;
      return categoryMatch && rarityMatch;
    });
  }

  /**
   * Retourne la classe CSS selon la rareté
   */
  getRarityClass(rarete: string): string {
    return `rarity-${rarete.toLowerCase()}`;
  }

  /**
   * Retourne la couleur de la barre de progression selon la rareté
   */
  getProgressBarColor(rarete: string): string {
    const colors: { [key: string]: string } = {
      Commun: '#4CAF50',
      Rare: '#2196F3',
      Épique: '#9C27B0',
      Légendaire: '#FF9800',
    };
    return colors[rarete] || '#4CAF50';
  }

  /**
   * Formate la date de déblocage
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Calcule le pourcentage de progression
   */
  getProgressPercentage(achievement: Achievement): number {
    if (achievement.progression !== undefined) {
      return Math.round(achievement.progression * 100);
    }
    if (
      achievement.progressionActuelle !== undefined &&
      achievement.progressionRequise !== undefined
    ) {
      return Math.round((achievement.progressionActuelle / achievement.progressionRequise) * 100);
    }
    return 0;
  }

  /**
   * Retourne le texte de progression
   */
  getProgressText(achievement: Achievement): string {
    if (
      achievement.progressionActuelle !== undefined &&
      achievement.progressionRequise !== undefined
    ) {
      return `${achievement.progressionActuelle} / ${achievement.progressionRequise}`;
    }
    return `${this.getProgressPercentage(achievement)}%`;
  }
}
