import { Injectable, signal } from '@angular/core';
import { GameSession, GuessResponse } from '../models/boss.model';

@Injectable({
  providedIn: 'root',
})
export class GameState {
  private currentSession = signal<GameSession | null>(null);

  getCurrentSession() {
    return this.currentSession.asReadonly();
  }

  setSession(sessionId: string) {
    this.currentSession.set({
      sessionId,
      bossSecret: null as any,
      tentatives: 0,
      propositions: [],
      terminee: false,
    });
  }

  addProposition(guess: GuessResponse) {
    const session = this.currentSession();
    if (session) {
      this.currentSession.set({
        ...session,
        tentatives: guess.tentatives,
        propositions: [guess, ...session.propositions],
        terminee: guess.correct,
      });
    }
  }

  resetSession() {
    this.currentSession.set(null);
  }
}
