import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUdsComponent } from './crear-uds.component';

describe('CrearUdsComponent', () => {
  let component: CrearUdsComponent;
  let fixture: ComponentFixture<CrearUdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearUdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearUdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
