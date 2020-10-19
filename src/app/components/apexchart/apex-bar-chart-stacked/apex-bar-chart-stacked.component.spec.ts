import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexBarChartStackedComponent } from './apex-bar-chart-stacked.component';

describe('ApexBarChartStackedComponent', () => {
  let component: ApexBarChartStackedComponent;
  let fixture: ComponentFixture<ApexBarChartStackedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApexBarChartStackedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApexBarChartStackedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
