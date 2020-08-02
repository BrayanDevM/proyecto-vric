import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAcercaDeComponent } from './dialog-acerca-de.component';

describe('DialogAcercaDeComponent', () => {
  let component: DialogAcercaDeComponent;
  let fixture: ComponentFixture<DialogAcercaDeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAcercaDeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAcercaDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
