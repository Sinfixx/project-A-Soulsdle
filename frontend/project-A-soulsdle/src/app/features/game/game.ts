import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { GameState } from '../../services/game-state';
import { Boss, GuessResponse } from '../../models/boss.model';

@Component({
  selector: 'app-game',
  imports: [CommonModule, FormsModule],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game {
  bossGuess = signal('');
  allBossNames = signal<string[]>([]);
  gameStarted = signal(false);
  isLoading = signal(false);
  currentGuess = signal<GuessResponse | null>(null);
  bossDetails = signal<Map<string, Boss>>(new Map());
  showVictory = signal(false);
  victoryBoss = signal<Boss | null>(null);

  constructor(private api: Api, public gameState: GameState) {
    this.loadBossNames();
  }

  loadBossNames() {
    this.api.getBossList(100).subscribe({
      next: (data) => {
        this.allBossNames.set(data.boss);
      },
      error: (err) => console.error('Erreur chargement boss:', err),
    });
  }

  startGame() {
    this.isLoading.set(true);
    this.showVictory.set(false);
    this.api.startGame().subscribe({
      next: (data) => {
        this.gameState.setSession(data.sessionId);
        this.gameStarted.set(true);
        this.bossGuess.set('');
        this.bossDetails.set(new Map());
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur démarrage:', err);
        this.isLoading.set(false);
      },
    });
  }

  submitGuess() {
    const proposition = this.bossGuess().trim();
    const session = this.gameState.getCurrentSession()();

    if (!proposition || !session) return;

    this.isLoading.set(true);

    // Récupérer les détails du boss proposé
    this.api.getBossDetail(proposition).subscribe({
      next: (bossData) => {
        // Sauvegarder les détails
        const details = this.bossDetails();
        details.set(proposition, bossData);
        this.bossDetails.set(new Map(details));

        // Soumettre la proposition
        this.api.submitGuess(session.sessionId, proposition).subscribe({
          next: (guessResponse) => {
            this.gameState.addProposition(guessResponse);
            this.bossGuess.set('');
            this.isLoading.set(false);

            if (guessResponse.correct) {
              this.victoryBoss.set(bossData);
              setTimeout(() => {
                this.showVictory.set(true);
                this.createConfetti();
              }, 500);
            }
          },
          error: (err) => {
            console.error('Erreur proposition:', err);
            this.isLoading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Erreur récupération boss:', err);
        this.isLoading.set(false);
        alert('Boss non trouvé : ' + proposition);
      },
    });
  }

  createConfetti() {
    const colors = [
      '#ffffff',
      '#4ecdc4',
      '#45b7d1',
      '#ffd700',
      '#2ecc71',
      '#e74c3c',
      '#9b59b6',
      '#f39c12',
    ];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3500);
      }, i * 30);
    }
  }

  getBossDetails(nom: string): Boss | undefined {
    return this.bossDetails().get(nom);
  }
}
