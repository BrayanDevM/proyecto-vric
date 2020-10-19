import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApexLineChartMinComponent } from './apex-line-chart-min.component';

describe('ApexLineChartMinComponent', () => {
  let component: ApexLineChartMinComponent;
  let fixture: ComponentFixture<ApexLineChartMinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApexLineChartMinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApexLineChartMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
