import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Boss, GuessResponse } from '../models/boss.model';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Boss endpoints
  getBossList(limit?: number, jeu?: string, dlc?: string): Observable<{ boss: string[] }> {
    let url = `${this.apiUrl}/boss?limit=${limit || 100}`;
    if (jeu) url += `&jeu=${jeu}`;
    if (dlc) url += `&dlc=${dlc}`;
    return this.http.get<{ boss: string[] }>(url);
  }

  getBossDetail(nom: string): Observable<Boss> {
    return this.http.get<Boss>(`${this.apiUrl}/boss/${encodeURIComponent(nom)}`);
  }

  createBoss(boss: Omit<Boss, '_id'>): Observable<Boss> {
    return this.http.post<Boss>(`${this.apiUrl}/boss`, boss);
  }

  updateBoss(nom: string, boss: Partial<Boss>): Observable<Boss> {
    return this.http.put<Boss>(`${this.apiUrl}/boss/${encodeURIComponent(nom)}`, boss);
  }

  deleteBoss(nom: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/boss/${encodeURIComponent(nom)}`);
  }

  // Game endpoints
  startGame(): Observable<{ sessionId: string; nbBoss: number; message: string }> {
    return this.http.get<{ sessionId: string; nbBoss: number; message: string }>(
      `${this.apiUrl}/jeu`,
    );
  }

  submitGuess(sessionId: string, proposition: string): Observable<GuessResponse> {
    return this.http.post<GuessResponse>(`${this.apiUrl}/jeu/guess`, { sessionId, proposition });
  }

  // Stats endpoints
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
