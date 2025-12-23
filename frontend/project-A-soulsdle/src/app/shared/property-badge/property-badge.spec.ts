import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyBadge } from './property-badge';

describe('PropertyBadge', () => {
  let component: PropertyBadge;
  let fixture: ComponentFixture<PropertyBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
