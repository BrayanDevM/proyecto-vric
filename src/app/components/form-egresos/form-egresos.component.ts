import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { Beneficiario } from 'src/app/models/beneficiario.model';
declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'app-form-egresos',
  templateUrl: './form-egresos.component.html',
  styleUrls: ['./form-egresos.component.css']
})
export class FormEgresosComponent implements OnInit {
  formEgreso: FormGroup;
  usuario: any;
  @Input() udsAsignadas: Uds[];
  beneficiarios: Beneficiario[];
  beneficiarioEgreso: Beneficiario;

  constructor(
    private fb: FormBuilder,
    private usuario$: UsuarioService,
    private beneficiarios$: BeneficiariosService,
    private uds$: UdsService
  ) {}

  ngOnInit() {
    this.usuario = this.usuario$.usuario;

    this.formEgreso = this.fb.group({
      udsId: [null, Validators.required],
      beneficiarioId: [null, Validators.required],
      egreso: [null, Validators.required]
    });
  }

  traerBeneficiarios(udsId: string) {
    this.beneficiarios = [];
    this.uds$.obtenerUnidad(udsId).subscribe((resp: any) => {
      const beneficiariosVinculados = [];
      this.beneficiarios = resp.unidad.beneficiarios;
      this.beneficiarios.forEach((beneficiario: Beneficiario) => {
        if (beneficiario.estado === 'Vinculado') {
          beneficiariosVinculados.push(beneficiario);
        }
      });
      this.beneficiarios = beneficiariosVinculados;
    });
    this.refrescarSelect();
  }

  reportarEgreso() {
    const index = this.beneficiarios.findIndex(
      beneficiario => beneficiario._id === this.formEgreso.value.beneficiarioId
    );
    this.beneficiarioEgreso = this.beneficiarios[index];

    this.beneficiarioEgreso.egreso = moment(
      this.formEgreso.value.egreso,
      'YYYY-MM-DD'
    ).format('DD/MM/YYYY');

    this.beneficiarioEgreso.estado = 'Pendiente desvincular';
    console.log('beneficiario a desvincular: ', this.beneficiarioEgreso);

    Swal.fire({
      title: 'Reportar egreso',
      html: `Estás segura de solicitar la desvinculación de <b>
      ${this.beneficiarioEgreso.nombre1} ${this.beneficiarioEgreso.nombre2}
      ${this.beneficiarioEgreso.apellido1} ${this.beneficiarioEgreso.apellido2}
      </b>, esta acción no puedes deshacerse.`,
      icon: 'warning',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reportar egreso'
    }).then((result: any) => {
      if (result.value) {
        this.beneficiarios$
          .actualizarBeneficiario(this.beneficiarioEgreso)
          .subscribe((resp: any) => {
            if (resp.ok === true) {
              Swal.fire({
                title: 'Reportar egreso',
                html: `Egreso reportado correctamente`,
                icon: 'success'
              });
              this.formEgreso.reset();
              this.refrescarSelect();
            }
          });
      }
    });
  }

  refrescarSelect() {
    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, 800);
  }
}
