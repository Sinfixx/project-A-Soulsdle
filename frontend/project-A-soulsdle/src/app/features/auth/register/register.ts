import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, RegisterRequest } from '../../../services/auth';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerData: RegisterRequest = {
    pseudo: '',
    email: '',
    password: '',
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: Auth,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('✅ Inscription réussie', response);
        this.successMessage = 'Inscription réussie ! Redirection...';
        setTimeout(() => {
          this.router.navigate(['/game']);
        }, 1500);
      },
      error: (error) => {
        console.error("❌ Erreur d'inscription", error);
        this.errorMessage = error.error?.error || "Erreur lors de l'inscription";
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
