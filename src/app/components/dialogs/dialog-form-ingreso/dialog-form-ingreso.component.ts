import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
declare const moment: any;

@Component({
  selector: 'app-dialog-form-ingreso',
  templateUrl: './dialog-form-ingreso.component.html',
  styleUrls: ['./dialog-form-ingreso.component.css']
})
export class DialogFormIngresoComponent implements OnInit {
  nacimientoBen: string;
  form: any;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public formIngreso: any
  ) {
    this.form = this.formIngreso.getRawValue();
    // console.log(this.form, '<- form recibido');

    this.nacimientoBen = moment(this.form.nacimiento).format('DD/MM/YYYY');
  }

  ngOnInit(): void {}

  onNoClick() {
    this.dialogRef.close();
  }
}
