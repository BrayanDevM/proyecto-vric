import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIngresosComponent } from './form-ingresos.component';

describe('FormIngresosComponent', () => {
  let component: FormIngresosComponent;
  let fixture: ComponentFixture<FormIngresosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormIngresosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
