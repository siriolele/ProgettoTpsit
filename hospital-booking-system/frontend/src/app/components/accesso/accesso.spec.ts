import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accesso } from './accesso';

describe('Accesso', () => {
  let component: Accesso;
  let fixture: ComponentFixture<Accesso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accesso],
    }).compileComponents();

    fixture = TestBed.createComponent(Accesso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
