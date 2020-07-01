import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCambiosComponent } from './form-cambios.component';

describe('FormCambiosComponent', () => {
  let component: FormCambiosComponent;
  let fixture: ComponentFixture<FormCambiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCambiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCambiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
