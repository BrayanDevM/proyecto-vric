import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-beneficiario-form',
  templateUrl: './beneficiario-form.component.html',
  styleUrls: ['./beneficiario-form.component.css']
})
export class BeneficiarioFormComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dialog.closeAll();
  }
}
