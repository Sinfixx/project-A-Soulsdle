import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossCard } from './boss-card';

describe('BossCard', () => {
  let component: BossCard;
  let fixture: ComponentFixture<BossCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BossCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BossCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
