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
  nacimientoResp: string;
  form: any;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public formIngreso: any
  ) {
    this.form = this.formIngreso.getRawValue();
    this.formatearFechas();
    // console.log(this.form, '<- form recibido');
  }

  ngOnInit(): void {}

  onNoClick() {
    this.dialogRef.close();
  }

  formatearFechas() {
    this.nacimientoBen = moment(this.form.nacimiento).format('DD/MM/YYYY');

    /**
     * Si la fecha recibida del responsable es un objeto, significa que fue creada
     * desde el formulario de ingreso, si no, será un string, ya que el formulario
     * de cambio de mujer gestante ya entrega la fecha formateada desde la BD
     */
    if (typeof this.form.respNacimiento === 'object') {
      this.nacimientoResp = moment(this.form.respNacimiento).format(
        'DD/MM/YYYY'
      );
    } else {
      this.nacimientoResp = this.form.respNacimiento;
    }
  }
}
