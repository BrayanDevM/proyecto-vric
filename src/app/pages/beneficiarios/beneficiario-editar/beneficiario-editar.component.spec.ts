import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarioEditarComponent } from './beneficiario-editar.component';

describe('BeneficiarioEditarComponent', () => {
  let component: BeneficiarioEditarComponent;
  let fixture: ComponentFixture<BeneficiarioEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiarioEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiarioEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
