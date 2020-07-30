import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { alertSuccess, alertDanger } from 'src/app/helpers/swal2.config';
import { NgOption } from '@ng-select/ng-select';
import { Usuario } from 'src/app/models/usuario.model';
declare var moment: any;

@Component({
  selector: 'app-form-egresos',
  templateUrl: './form-egresos.component.html',
  styleUrls: ['./form-egresos.component.css']
})
export class FormEgresosComponent implements OnInit {
  // ng-select -------------------
  motivosDeEgreso: NgOption = [
    {
      value: 'Retiro voluntario del programa',
      label: 'Retiro voluntario del programa'
    },
    { value: 'Tránsito a otro programa', label: 'Tránsito a otro programa' },
    { value: 'Traslado de municipio', label: 'Traslado de municipio' },
    { value: 'Cambio a bebé lactante', label: 'Cambio a bebé lactante' },
    {
      value: 'Distancia del centro de atención',
      label: 'Distancia del centro de atención'
    },
    { value: 'Edad cumplida', label: 'Edad cumplida' },
    { value: 'Enfermedad', label: 'Enfermedad' },
    { value: 'Fallecimiento', label: 'Fallecimiento' },
    { value: 'No le gusta la comida', label: 'No le gusta la comida' },
    {
      value: 'En casa hay quien lo cuide',
      label: 'En casa hay quien lo cuide'
    },
    {
      value: 'Alto costo para la familia (transporte)',
      label: 'Alto costo para la familia (transporte)'
    },
    { value: 'Cambio vigencia', label: 'Cambio vigencia' },
    { value: 'Conflicto armado', label: 'Conflicto armado' },
    { value: 'Desplazamiento forzado', label: 'Desplazamiento forzado' },
    { value: 'Pasó al SIMAT', label: 'Pasó al SIMAT' },
    { value: 'Otro', label: 'Otro' }
  ];
  // -------------------------
  formEgreso: FormGroup;
  usuario: Usuario;
  @Input() udsAsignadas: Uds[];
  beneficiarios: Beneficiario[];
  cargandoBeneficiarios = false;
  actualizando = false;
  beneficiarioEgreso: Beneficiario;

  constructor(
    private fb: FormBuilder,
    private usuario$: UsuarioService,
    private beneficiarios$: BeneficiariosService,
    private uds$: UdsService
  ) {
    this.usuario = this.usuario$.usuario;
    this.formEgreso = this.fb.group({
      udsId: [null, Validators.required],
      beneficiarioId: [null, Validators.required],
      motivo: [null, Validators.required],
      egreso: [null, Validators.required]
    });
  }

  ngOnInit() {}

  traerBeneficiarios($event: any) {
    this.cargandoBeneficiarios = true;
    this.beneficiarios = [];
    let contador = 0;
    this.uds$.obtenerUnidad_beneficiarios($event._id).subscribe((resp: any) => {
      if (resp.ok) {
        const beneficiariosVinculados = [];
        this.beneficiarios = resp.unidad.beneficiarios;
        this.beneficiarios.forEach((beneficiario: Beneficiario) => {
          if (beneficiario.estado === 'Vinculado') {
            beneficiariosVinculados.push(beneficiario);
          }
          contador++;
          if (contador === this.beneficiarios.length) {
            this.beneficiarios = beneficiariosVinculados;
            this.cargandoBeneficiarios = false;
          }
        });
      } else {
        this.cargandoBeneficiarios = false;
      }
    });
  }

  reportarEgreso() {
    const index = this.beneficiarios.findIndex(
      beneficiario => beneficiario._id === this.formEgreso.value.beneficiarioId
    );

    this.beneficiarioEgreso = this.beneficiarios[index];
    console.log(this.beneficiarios);

    this.beneficiarioEgreso.creadoPor = this.usuario._id;
    this.beneficiarioEgreso.motivoEgreso = this.formEgreso.value.motivo;
    this.beneficiarioEgreso.responsableId = this.beneficiarioEgreso.responsableId;
    this.beneficiarioEgreso.uds = this.beneficiarioEgreso.uds;

    this.beneficiarioEgreso.egreso = moment(
      this.formEgreso.value.egreso,
      'YYYY-MM-DD'
    ).format('DD/MM/YYYY');

    this.beneficiarioEgreso.estado = 'Pendiente desvincular';

    alertDanger
      .fire({
        title: 'Novedades',
        html: `Estás segura de solicitar la desvinculación de <b>
      ${this.beneficiarioEgreso.nombre1} ${this.beneficiarioEgreso.nombre2}
      ${this.beneficiarioEgreso.apellido1} ${this.beneficiarioEgreso.apellido2}
      </b>, esta acción no puede deshacerse.`,
        confirmButtonText: 'Sí, reportar egreso'
      })
      .then((result: any) => {
        if (result.value) {
          this.actualizando = true;
          this.beneficiarios$
            .actualizarBeneficiario(this.beneficiarioEgreso)
            .subscribe(
              (resp: any) => {
                if (resp.ok === true) {
                  alertSuccess.fire({
                    title: 'Beneficiario reportado'
                  });
                  this.actualizando = false;
                  this.formEgreso.reset();
                } else {
                  this.actualizando = false;
                }
              },
              error => {
                this.actualizando = false;
                console.log(error);
              }
            );
        }
      });
  }
}
