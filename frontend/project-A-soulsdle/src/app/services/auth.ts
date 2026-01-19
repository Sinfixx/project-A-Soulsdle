import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  pseudo: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  joueur: {
    id: string;
    pseudo: string;
    email: string;
    partiesGagnees: number;
    streakActuelle: number;
    meilleureStreak: number;
  };
}

export interface JoueurProfile {
  id: string;
  pseudo: string;
  email: string;
  partiesGagnees: number;
  streakActuelle: number;
  meilleureStreak: number;
  dernierJourJoue?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/auth';
  private tokenKey = 'soulsdle_token';

  // Signal pour l'utilisateur connecté
  private currentUserSubject = new BehaviorSubject<JoueurProfile | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signal reactif pour savoir si l'utilisateur est connecté
  public isAuthenticated = computed(() => this.currentUserSubject.value !== null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Vérifier le token au démarrage
    this.checkAuthStatus();
  }

  /**
   * Inscription
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  /**
   * Connexion
   */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(tap((response) => this.handleAuthSuccess(response)));
  }

  /**
   * Déconnexion
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('soulsdle_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  getProfile(): Observable<{ joueur: JoueurProfile }> {
    return this.http.get<{ joueur: JoueurProfile }>(`${this.apiUrl}/me`).pipe(
      tap((response) => {
        this.currentUserSubject.next(response.joueur);
        this.storeUser(response.joueur);
      }),
    );
  }

  /**
   * Vérifier si le token est valide
   */
  verifyToken(): Observable<{ valid: boolean; joueur: JoueurProfile }> {
    return this.http.post<{ valid: boolean; joueur: JoueurProfile }>(`${this.apiUrl}/verify`, {});
  }

  /**
   * Récupérer le token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Récupérer l'utilisateur courant
   */
  getCurrentUser(): JoueurProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Vérifier le statut d'authentification au démarrage
   */
  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      this.verifyToken().subscribe({
        next: (response) => {
          if (response.valid) {
            this.currentUserSubject.next(response.joueur);
            this.storeUser(response.joueur);
          } else {
            this.logout();
          }
        },
        error: () => {
          this.logout();
        },
      });
    }
  }

  /**
   * Gérer le succès de l'authentification
   */
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    this.currentUserSubject.next(response.joueur);
    this.storeUser(response.joueur);
  }

  /**
   * Stocker l'utilisateur dans le localStorage
   */
  private storeUser(user: JoueurProfile): void {
    localStorage.setItem('soulsdle_user', JSON.stringify(user));
  }

  /**
   * Récupérer l'utilisateur du localStorage
   */
  private getStoredUser(): JoueurProfile | null {
    const userStr = localStorage.getItem('soulsdle_user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
