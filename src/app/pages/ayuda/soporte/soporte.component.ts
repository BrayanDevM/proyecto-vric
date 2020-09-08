import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { Reporte } from 'src/app/models/reportes.model';
import { alertSuccess } from 'src/app/helpers/swal2.config';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective
} from '@angular/forms';
declare const moment: any;

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css']
})
export class SoporteComponent implements OnInit {
  formSoporte: FormGroup;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(private reporte$: ReportesService, private fb: FormBuilder) {
    this.formSoporte = this.fb.group({
      asunto: ['', Validators.required],
      tipo: ['Mensaje', Validators.required],
      descripcion: [
        '',
        [
          Validators.required,
          Validators.minLength(40),
          Validators.maxLength(255)
        ]
      ],
      creadoEl: moment().format('MMMM Do YYYY, h:mm:ss a')
    });
  }

  ngOnInit(): void {}

  get fc() {
    return this.formSoporte.controls;
  }
  get fv() {
    return this.formSoporte.value;
  }

  resetForm() {
    this.formGroupDirective.resetForm();
  }

  crearReporte() {
    if (this.formSoporte.invalid) {
      this.formSoporte.markAllAsTouched();
      return;
    }
    this.reporte$
      .crearReporte(this.formSoporte.value)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.ok === true) {
          this.resetForm();
          alertSuccess.fire(
            'Tu solicitud se ha enviado',
            'Nos pondremos en contato contigo'
          );
        }
      });
  }
}
