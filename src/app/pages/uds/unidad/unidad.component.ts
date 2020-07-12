import { Component, OnInit } from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
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
  cargando = false;
  formActualizarUds: FormGroup;

  constructor(
    private usuarios$: UsuarioService,
    private uds$: UdsService,
    private rutaActual: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // Creo un objeto vacío para omitir errores de campos null al renderizar
    this.uds = null;
    // Obtener datos
    this.obtenerCoordinadores();
    this.obtenerGestores();
    this.obtenerDocentes();
    this.obtenerUnidad();

    // Intancio nuevo formulario
    this.formActualizarUds = this.fb.group({
      codigo: [null, Validators.required],
      nombre: [null, Validators.required],
      cupos: null,
      ubicacion: null,
      coordinador: [null, Validators.required],
      gestor: [null, Validators.required],
      docentes: [null, Validators.required],
      arriendo: null,
      activa: false,
      creadoEl: null
    });
  }

  obtenerUnidad() {
    // Obtenemos id de la URL
    this.rutaActual.params.subscribe((resp: Params) => {
      this.uds$.obtenerUnidad(resp.id).subscribe((uds: any) => {
        this.uds = uds.unidad;
        const fechaCreadoEl = moment(this.uds.creadoEl, 'DD/MM/YYYY');
        this.uds.creadoEl = fechaCreadoEl.format('YYYY-MM-DD');
        if (this.uds.coordinador === null) {
          this.uds.coordinador = { _id: '' };
        }
        if (this.uds.gestor === null) {
          this.uds.gestor = { _id: '' };
        }
        if (this.uds.docentes !== null || this.uds.docentes) {
          this.uds.docentes.forEach((docente: Usuario) => {
            this.docentesEnUds.push(docente._id);
          });
        }
        // console.log('UDS obtenida: ', this.uds);
        // console.log(this.docentesEnUds);
      });
    });
  }

  obtenerDocentes() {
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
    this.cargando = true;
    this.uds.arriendo = this.formActualizarUds.value.arriendo;
    this.uds.codigo = this.formActualizarUds.value.codigo;
    this.uds.nombre = this.formActualizarUds.value.nombre;
    this.uds.cupos = this.formActualizarUds.value.cupos;
    this.uds.coordinador = this.formActualizarUds.value.coordinador;
    this.uds.docentes = this.docentesEnUds;
    this.uds.gestor = this.formActualizarUds.value.gestor;
    this.uds.ubicacion = this.formActualizarUds.value.ubicacion;
    this.uds.activa = this.formActualizarUds.value.activa;
    // Valores devueltos a _id ya que populate devuelve un objeto
    this.uds.creadoPor = this.uds.creadoPor._id;

    if (this.uds.enContrato !== null) {
      this.uds.enContrato = this.uds.enContrato._id;
    }
    this.uds$.actualizarUds(this.uds).subscribe(resp => {
      // console.log(resp);
      this.router.navigate(['/uds']);
    });
    this.cargando = false;
    this.docentesEnUds = [];
  }
}
