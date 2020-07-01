import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisBeneficiariosComponent } from './mis-beneficiarios.component';

describe('MisBeneficiariosComponent', () => {
  let component: MisBeneficiariosComponent;
  let fixture: ComponentFixture<MisBeneficiariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisBeneficiariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisBeneficiariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
