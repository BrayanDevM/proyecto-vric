import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActualizacionesComponent } from './modal-actualizaciones.component';

describe('ModalActualizacionesComponent', () => {
  let component: ModalActualizacionesComponent;
  let fixture: ComponentFixture<ModalActualizacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalActualizacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalActualizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
