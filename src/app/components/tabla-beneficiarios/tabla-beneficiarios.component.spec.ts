import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBeneficiariosComponent } from './tabla-beneficiarios.component';

describe('TablaBeneficiariosComponent', () => {
  let component: TablaBeneficiariosComponent;
  let fixture: ComponentFixture<TablaBeneficiariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaBeneficiariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaBeneficiariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
