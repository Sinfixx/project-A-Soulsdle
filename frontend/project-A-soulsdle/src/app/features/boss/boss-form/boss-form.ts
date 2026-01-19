import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Boss } from '../../../models/boss.model';

@Component({
  selector: 'app-boss-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './boss-form.html',
  styleUrl: './boss-form.css',
})
export class BossForm implements OnChanges {
  @Input() boss?: Boss;
  @Input() isOpen = false;
  @Output() save = new EventEmitter<Partial<Boss>>();
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Boss>();

  formData = signal<Partial<Boss>>({
    nom: '',
    jeu: 'Bloodborne',
    genre: 'Homme',
    espece: [],
    phases: 1,
    nombre: 1,
    cutscene: 'Oui',
    optionnel: 'Obligatoire',
    dlc: 'Base',
  });

  especeInput = signal('');

  // Options pour les sélecteurs
  jeux = ['Bloodborne', 'Sekiro', 'Dark Souls', 'Dark Souls III'];
  genres = ['Homme', 'Femme', 'Inconnu'];
  cutsceneOptions = ['Oui', 'Non'];
  optionnelOptions = ['Obligatoire', 'Optionnel'];
  dlcOptions = ['Base', 'DLC'];

  // Getters pour le binding
  get nom() {
    return this.formData().nom || '';
  }
  set nom(value: string) {
    this.updateField('nom', value);
  }

  get jeu() {
    return this.formData().jeu || 'Bloodborne';
  }
  set jeu(value: string) {
    this.updateField('jeu', value);
  }

  get genre() {
    return this.formData().genre || 'Homme';
  }
  set genre(value: any) {
    this.updateField('genre', value);
  }

  get phases() {
    return this.formData().phases || 1;
  }
  set phases(value: number) {
    this.updateField('phases', value);
  }

  get nombre() {
    return this.formData().nombre || 1;
  }
  set nombre(value: number | string) {
    this.updateField('nombre', value);
  }

  get cutscene() {
    return this.formData().cutscene || 'Oui';
  }
  set cutscene(value: any) {
    this.updateField('cutscene', value);
  }

  get optionnel() {
    return this.formData().optionnel || 'Obligatoire';
  }
  set optionnel(value: any) {
    this.updateField('optionnel', value);
  }

  get dlc() {
    return this.formData().dlc || 'Base';
  }
  set dlc(value: any) {
    this.updateField('dlc', value);
  }

  ngOnChanges(changes: SimpleChanges) {
    // Quand le boss ou isOpen change, mettre à jour le formulaire
    if (changes['boss'] && this.boss) {
      this.formData.set({ ...this.boss });
    } else if (changes['isOpen'] && this.isOpen && !this.boss) {
      // Si on ouvre le modal sans boss (création), réinitialiser
      this.resetForm();
    }
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.save.emit(this.formData());
      this.resetForm();
    }
  }

  onClose() {
    this.resetForm();
    this.close.emit();
  }

  addEspece() {
    const espece = this.especeInput().trim();
    if (espece && !this.formData().espece?.includes(espece)) {
      this.formData.update((data) => ({
        ...data,
        espece: [...(data.espece || []), espece],
      }));
      this.especeInput.set('');
    }
  }

  removeEspece(espece: string) {
    this.formData.update((data) => ({
      ...data,
      espece: data.espece?.filter((e) => e !== espece) || [],
    }));
  }

  isFormValid(): boolean {
    const data = this.formData();
    return !!(
      data.nom &&
      data.jeu &&
      data.genre &&
      data.espece &&
      data.espece.length > 0 &&
      data.phases &&
      data.nombre &&
      data.cutscene &&
      data.optionnel &&
      data.dlc
    );
  }

  resetForm() {
    this.formData.set({
      nom: '',
      jeu: 'Bloodborne',
      genre: 'Homme',
      espece: [],
      phases: 1,
      nombre: 1,
      cutscene: 'Oui',
      optionnel: 'Obligatoire',
      dlc: 'Base',
    });
    this.especeInput.set('');
  }

  updateField<K extends keyof Boss>(field: K, value: Boss[K]) {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  onDelete() {
    if (this.boss && confirm(`Voulez-vous vraiment supprimer "${this.boss.nom}" ?`)) {
      this.delete.emit(this.boss);
    }
  }
}
