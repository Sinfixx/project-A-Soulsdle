import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Boss } from '../../../models/boss.model';

@Component({
  selector: 'app-boss-card',
  imports: [CommonModule],
  templateUrl: './boss-card.html',
  styleUrl: './boss-card.css',
})
export class BossCard {
  @Input() boss!: Boss;
  @Output() edit = new EventEmitter<Boss>();

  onEdit() {
    this.edit.emit(this.boss);
  }

  getGameThemeClass(): string {
    const gameMap: { [key: string]: string } = {
      Bloodborne: 'theme-bloodborne',
      Sekiro: 'theme-sekiro',
      'Dark Souls': 'theme-darksouls',
      'Dark Souls 2': 'theme-darksouls2',
      'Dark Souls 3': 'theme-darksouls3',
      "Demon's Souls": 'theme-demonssouls',
      'Elden Ring': 'theme-eldenring',
    };
    return gameMap[this.boss.jeu] || 'theme-default';
  }
}
