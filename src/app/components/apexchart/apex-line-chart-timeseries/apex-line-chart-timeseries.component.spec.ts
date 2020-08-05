import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexLineChartTimeseriesComponent } from './apex-line-chart-timeseries.component';

describe('ApexLineChartTimeseriesComponent', () => {
  let component: ApexLineChartTimeseriesComponent;
  let fixture: ComponentFixture<ApexLineChartTimeseriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApexLineChartTimeseriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApexLineChartTimeseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
