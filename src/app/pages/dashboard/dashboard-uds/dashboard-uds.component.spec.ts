import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUdsComponent } from './dashboard-uds.component';

describe('DashboardUdsComponent', () => {
  let component: DashboardUdsComponent;
  let fixture: ComponentFixture<DashboardUdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardUdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
