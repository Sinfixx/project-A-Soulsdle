import { TestBed } from '@angular/core/testing';

import { Boss } from './boss';

describe('Boss', () => {
  let service: Boss;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Boss);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
