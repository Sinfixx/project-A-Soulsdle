import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BossList } from './boss-list';

describe('BossList', () => {
  let component: BossList;
  let fixture: ComponentFixture<BossList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BossList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BossList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
