import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../services/api';
import { Boss } from '../../../models/boss.model';
import { BossCard } from '../boss-card/boss-card';
import { BossForm } from '../boss-form/boss-form';

@Component({
  selector: 'app-boss-list',
  imports: [CommonModule, FormsModule, BossCard, BossForm],
  templateUrl: './boss-list.html',
  styleUrl: './boss-list.css',
})
export class BossList {
  allBoss = signal<Boss[]>([]);
  isLoading = signal(true);
  searchTerm = signal('');
  selectedGame = signal('');
  selectedDlc = signal('');

  // Modal state
  isFormOpen = signal(false);
  editingBoss = signal<Boss | undefined>(undefined);

  // Liste filtrée des boss
  filteredBoss = computed(() => {
    let boss = this.allBoss();
    const search = this.searchTerm().toLowerCase();
    const game = this.selectedGame();
    const dlc = this.selectedDlc();

    if (search) {
      boss = boss.filter((b) => b.nom.toLowerCase().includes(search));
    }

    if (game) {
      boss = boss.filter((b) => b.jeu === game);
    }

    if (dlc) {
      boss = boss.filter((b) => b.dlc === dlc);
    }

    return boss;
  });

  // Liste des jeux uniques
  availableGames = computed(() => {
    const games = new Set(this.allBoss().map((b) => b.jeu));
    return Array.from(games).sort();
  });

  constructor(private api: Api) {
    this.loadAllBoss();
  }

  loadAllBoss() {
    this.isLoading.set(true);
    this.api.getBossList(100).subscribe({
      next: (data) => {
        // Charger les détails de chaque boss
        const promises = data.boss.map((name) => this.api.getBossDetail(name).toPromise());

        Promise.all(promises)
          .then((bossDetails) => {
            this.allBoss.set(bossDetails.filter((b) => b !== undefined) as Boss[]);
            this.isLoading.set(false);
          })
          .catch((err) => {
            console.error('Erreur chargement détails:', err);
            this.isLoading.set(false);
          });
      },
      error: (err) => {
        console.error('Erreur chargement boss:', err);
        this.isLoading.set(false);
      },
    });
  }

  resetFilters() {
    this.searchTerm.set('');
    this.selectedGame.set('');
    this.selectedDlc.set('');
  }

  // CRUD operations
  openCreateModal() {
    this.editingBoss.set(undefined);
    this.isFormOpen.set(true);
  }

  openEditModal(boss: Boss) {
    this.editingBoss.set(boss);
    this.isFormOpen.set(true);
  }

  closeModal() {
    this.isFormOpen.set(false);
    this.editingBoss.set(undefined);
  }

  saveBoss(bossData: Partial<Boss>) {
    const editing = this.editingBoss();

    if (editing) {
      // Update existing boss
      this.api.updateBoss(editing.nom, bossData).subscribe({
        next: (updatedBoss) => {
          this.allBoss.update((bosses) =>
            bosses.map((b) => (b.nom === editing.nom ? updatedBoss : b)),
          );
          this.closeModal();
          alert('Boss modifié avec succès !');
        },
        error: (err) => {
          console.error('Erreur modification boss:', err);
          alert(`Erreur: ${err.error?.error || 'Impossible de modifier le boss'}`);
        },
      });
    } else {
      // Create new boss
      this.api.createBoss(bossData as Omit<Boss, '_id'>).subscribe({
        next: (newBoss) => {
          this.allBoss.update((bosses) => [...bosses, newBoss]);
          this.closeModal();
          alert('Boss créé avec succès !');
        },
        error: (err) => {
          console.error('Erreur création boss:', err);
          alert(`Erreur: ${err.error?.error || 'Impossible de créer le boss'}`);
        },
      });
    }
  }

  deleteBoss(boss: Boss) {
    this.api.deleteBoss(boss.nom).subscribe({
      next: () => {
        this.allBoss.update((bosses) => bosses.filter((b) => b.nom !== boss.nom));
        this.closeModal();
        alert('Boss supprimé avec succès !');
      },
      error: (err) => {
        console.error('Erreur suppression boss:', err);
        alert(`Erreur: ${err.error?.error || 'Impossible de supprimer le boss'}`);
      },
    });
  }
}
