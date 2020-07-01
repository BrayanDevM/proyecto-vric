import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEgresosComponent } from './form-egresos.component';

describe('FormEgresosComponent', () => {
  let component: FormEgresosComponent;
  let fixture: ComponentFixture<FormEgresosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEgresosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
