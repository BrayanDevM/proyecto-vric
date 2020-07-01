import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdsComponent } from './uds.component';

describe('UdsComponent', () => {
  let component: UdsComponent;
  let fixture: ComponentFixture<UdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
