import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexPieChartComponent } from './apex-pie-chart.component';

describe('ApexPieChartComponent', () => {
  let component: ApexPieChartComponent;
  let fixture: ComponentFixture<ApexPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApexPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApexPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
