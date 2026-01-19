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
}
