import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearContratoComponent } from './crear-contrato.component';

describe('CrearContratoComponent', () => {
  let component: CrearContratoComponent;
  let fixture: ComponentFixture<CrearContratoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearContratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
