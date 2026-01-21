import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Soul {
  id: string;
  nom: string;
  annee: number;
  developpeur: string;
  genre: string;
  plateforme: string[];
}

@Component({
  selector: 'app-souls',
  imports: [CommonModule],
  templateUrl: './souls.html',
  styleUrl: './souls.css',
})
export class Souls implements OnInit {
  souls: Soul[] = [];
  loading = true;
  error: string | null = null;

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadSouls();
  }

  loadSouls() {
    this.loading = true;
    this.error = null;

    this.http.get<{ souls: Soul[] }>(`${this.apiUrl}/souls`).subscribe({
      next: (response) => {
        console.log('Souls reçus:', response);
        this.souls = response.souls.sort((a, b) => a.annee - b.annee); // Tri par année
        this.loading = false;
        this.cdr.detectChanges(); // Force la détection de changement
      },
      error: (err) => {
        console.error('Erreur lors du chargement des Souls:', err);
        this.error = 'Erreur lors du chargement des jeux';
        this.loading = false;
        this.cdr.detectChanges(); // Force la détection de changement
      },
    });
  }

  getGameIcon(nom: string): string {
    const icons: { [key: string]: string } = {
      "Demon's Souls": '👹',
      'Dark Souls': '🔥',
      'Dark Souls II': '⚔️',
      'Dark Souls III': '🌑',
      Bloodborne: '🩸',
      'Sekiro: Shadows Die Twice': '🌸',
      'Elden Ring': '💍',
    };
    return icons[nom] || '🎮';
  }
}
