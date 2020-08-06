import { Component, OnInit } from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { alertSuccess, alertError } from 'src/app/helpers/swal2.config';
declare var moment: any;

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css']
})
export class UnidadComponent implements OnInit {
  // valores ng-select
  estadoArriendo: NgOption = [
    { value: true, label: 'Con arriendo' },
    { value: false, label: 'Sin arriendo' }
  ];
  estadoUds: NgOption = [
    { value: true, label: 'Activa' },
    { value: false, label: 'Inactiva' }
  ];
  // ------------------------
  uds: Uds;
  coordinadores: Usuario[];
  cargandoCoords = false;
  gestores: Usuario[];
  cargandoGestores = false;
  docentes: Usuario[];
  cargandoDocentes = false;
  docentesEnUds = [];
  actualizando = false;
  formActualizarUds: FormGroup;

  constructor(
    private usuarios$: UsuarioService,
    private uds$: UdsService,
    private rutaActual: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Intancio nuevo formulario
    this.formActualizarUds = this.fb.group({
      codigo: [null, Validators.required],
      nombre: [null, Validators.required],
      cupos: [null, Validators.required],
      ubicacion: [null, Validators.required],
      coordinador: [null, Validators.required],
      gestor: [null, Validators.required],
      docentes: [null, Validators.required],
      arriendo: null,
      activa: false,
      creadoEl: null
    });
  }

  ngOnInit() {
    // Obtener datos
    this.obtenerUnidad().then((unidad: Uds) => {
      this.uds = this.formatearFechas(unidad);
      this.tomarDocentes(unidad);
      this.obtenerCoordinadores();
      this.obtenerGestores();
      this.obtenerDocentes();
      this.actualizarForm(this.uds);
    });
  }

  obtenerUnidad() {
    return new Promise((resolve, reject) => {
      this.rutaActual.params.subscribe((params: Params) => {
        this.uds$.obtenerUnidad(params.id).subscribe((resp: any) => {
          if (resp.ok) {
            resolve(resp.unidad);
          } else {
            reject(resp);
          }
        });
      });
    });
  }

  formatearFechas(unidad: Uds) {
    unidad.creadoEl = moment(unidad.creadoEl, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );
    return unidad;
  }

  tomarDocentes(unidad: Uds) {
    if (unidad.docentes !== null || unidad.docentes) {
      unidad.docentes.forEach((docente: Usuario) => {
        this.docentesEnUds.push(docente._id);
      });
    }
  }

  actualizarForm(unidad: Uds) {
    this.formActualizarUds.setValue({
      codigo: unidad.codigo,
      nombre: unidad.nombre,
      cupos: unidad.cupos,
      ubicacion: unidad.ubicacion,
      coordinador: unidad.coordinador._id,
      gestor: unidad.gestor._id,
      docentes: this.docentesEnUds,
      arriendo: unidad.arriendo,
      activa: unidad.activa,
      creadoEl: unidad.creadoEl
    });
  }

  obtenerDocentes() {
    this.cargandoDocentes = true;
    this.usuarios$.obtenerUsuarios().subscribe((resp: any) => {
      if (resp.ok) {
        const arreglo = [];
        resp.usuarios.forEach((usuario: Usuario) => {
          if (usuario.rol === 'DOCENTE') {
            arreglo.push(usuario);
          }
        });
        this.docentes = arreglo;
        this.cargandoDocentes = false;
      } else {
        this.cargandoDocentes = false;
      }
    });
  }

  obtenerCoordinadores() {
    this.cargandoCoords = true;
    this.usuarios$.obtenerUsuarios().subscribe((resp: any) => {
      if (resp.ok) {
        const arreglo = [];
        resp.usuarios.forEach((usuario: Usuario) => {
          if (usuario.rol === 'COORDINADOR') {
            arreglo.push(usuario);
          }
        });
        this.coordinadores = arreglo;
        this.cargandoCoords = false;
      } else {
        this.cargandoCoords = false;
      }
    });
  }

  obtenerGestores() {
    this.cargandoGestores = true;
    this.usuarios$.obtenerUsuarios().subscribe((resp: any) => {
      if (resp.ok) {
        const arreglo = [];
        resp.usuarios.forEach((usuario: Usuario) => {
          if (usuario.rol === 'ADMIN') {
            arreglo.push(usuario);
          }
        });
        this.gestores = arreglo;
        this.cargandoGestores = false;
      } else {
        this.cargandoGestores = false;
      }
    });
  }

  actualizar() {
    this.actualizando = true;
    if (this.formActualizarUds.invalid) {
      this.actualizando = false;
      return;
    }
    this.uds.codigo = this.formActualizarUds.value.codigo;
    this.uds.nombre = this.formActualizarUds.value.nombre;
    this.uds.cupos = this.formActualizarUds.value.cupos;
    this.uds.ubicacion = this.formActualizarUds.value.ubicacion;
    this.uds.arriendo = this.formActualizarUds.value.arriendo;
    this.uds.activa = this.formActualizarUds.value.activa;
    this.uds.coordinador = this.formActualizarUds.value.coordinador;
    this.uds.gestor = this.formActualizarUds.value.gestor;
    this.uds.docentes = this.formActualizarUds.value.docentes;
    // Valores devueltos a _id ya que populate devuelve un objeto
    this.uds.creadoPor = this.uds.creadoPor._id;
    if (this.uds.enContrato !== null) {
      this.uds.enContrato = this.uds.enContrato._id;
    }
    this.uds$.actualizarUds(this.uds).subscribe(resp => {
      if (resp.ok) {
        alertSuccess.fire({
          title: 'Unidad De Servicio actualizada'
        });
        this.actualizando = false;
        this.docentesEnUds = [];
        this.router.navigate(['/uds']);
      } else {
        this.actualizando = false;
        alertError.fire({
          title: 'Error',
          text:
            'No se ha podido actualizar la Unidad De Servicio, intentalo nuevamente',
          timer: 3000
        });
      }
    });
  }
}
