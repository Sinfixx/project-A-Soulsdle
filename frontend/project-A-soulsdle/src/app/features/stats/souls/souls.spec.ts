import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Souls } from './souls';

describe('Souls', () => {
  let component: Souls;
  let fixture: ComponentFixture<Souls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Souls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Souls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
