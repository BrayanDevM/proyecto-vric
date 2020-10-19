import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFormIngresoComponent } from './dialog-form-ingreso.component';

describe('DialogFormIngresoComponent', () => {
  let component: DialogFormIngresoComponent;
  let fixture: ComponentFixture<DialogFormIngresoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFormIngresoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFormIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
