import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, LoginRequest } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials: LoginRequest = {
    email: '',
    password: '',
  };

  loading = false;
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('✅ Connexion réussie', response);
        this.router.navigate(['/game']);
      },
      error: (error) => {
        console.error('❌ Erreur de connexion', error);
        this.errorMessage = error.error?.error || 'Erreur de connexion';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
