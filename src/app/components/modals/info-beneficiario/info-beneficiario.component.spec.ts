import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBeneficiarioComponent } from './info-beneficiario.component';

describe('InfoBeneficiarioComponent', () => {
  let component: InfoBeneficiarioComponent;
  let fixture: ComponentFixture<InfoBeneficiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoBeneficiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBeneficiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
