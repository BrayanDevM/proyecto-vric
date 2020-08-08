import { Component, OnInit } from '@angular/core';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  alertSuccess,
  alertError,
  alertDanger
} from 'src/app/helpers/swal2.config';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var moment: any;

@Component({
  selector: 'app-unidad',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css']
})
export class UnidadComponent implements OnInit {
  // ------------------------
  uds: Uds;
  coordinadores: Usuario[];
  cargandoCoords = false;
  gestores: Usuario[];
  cargandoGestores = false;
  docentes: Usuario[];
  cargandoDocentes = false;
  docentesEnUds = [];
  formActualizarUds: FormGroup;
  editMode = false;

  constructor(
    private usuarios$: UsuarioService,
    private uds$: UdsService,
    private router: Router,
    private snackBar$: MatSnackBar,
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
    this.obtenerInfoRuta().subscribe(paramId => {
      if (paramId === undefined) {
        return;
      }
      this.obtenerUnidad(paramId).then((unidad: Uds) => {
        this.uds = this.formatearFechas(unidad);
        this.docentesEnUnidad(unidad);
        this.obtenerCoordinadores();
        this.obtenerGestores();
        this.obtenerDocentes();
        this.actualizarForm(this.uds);
        this.editMode = false;
      });
    });
  }

  get fv() {
    return this.formActualizarUds.value;
  }

  ngOnInit() {}

  obtenerInfoRuta(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.params.id)
    );
  }

  obtenerUnidad(id: string) {
    return new Promise((resolve, reject) => {
      this.uds$.obtenerUnidad(id).subscribe((resp: any) => {
        if (resp.ok) {
          resolve(resp.unidad);
        } else {
          reject(resp);
        }
      });
    });
  }

  formatearFechas(unidad: Uds) {
    unidad.creadoEl = moment(unidad.creadoEl, 'DD/MM/YYYY').format(
      'YYYY-MM-DD'
    );
    return unidad;
  }

  docentesEnUnidad(unidad: Uds) {
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
    if (this.formActualizarUds.invalid) {
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
    this.uds$.actualizarUds(this.uds).subscribe((resp: any) => {
      if (resp.ok) {
        alertSuccess.fire({
          title: 'Unidad De Servicio actualizada'
        });
        this.uds$.udsActualizada$.emit(resp.udsActualizada);
        console.log(resp.udsActualizada, 'actualizada?');

        this.docentesEnUds = [];
        this.obtenerUnidad(this.uds._id).then((unidad: Uds) => {
          this.uds = this.formatearFechas(unidad);
          this.docentesEnUnidad(unidad);
          this.obtenerCoordinadores();
          this.obtenerGestores();
          this.obtenerDocentes();
          this.actualizarForm(this.uds);
          this.editMode = false;
        });
      } else {
        alertError.fire({
          title: 'Error',
          text:
            'No se ha podido actualizar la Unidad De Servicio, intentalo nuevamente',
          timer: 3000
        });
      }
    });
  }

  eliminar(uds: Uds) {
    alertDanger
      .fire({
        title: 'Eliminar Unidad De Servicio',
        html: `¿Estás seguro que deseas eliminar la Unidad De Servicio <b>${uds.nombre}</b>?, esta acción no puede deshacerse.`,
        confirmButtonText: 'Estoy seguro, eliminar'
      })
      .then(result => {
        if (result.value) {
          this.uds$.eliminarUds(uds).subscribe((resp: any) => {
            if (resp.ok === true) {
              this.uds$.udsEliminada$.emit(uds._id);
              alertSuccess.fire({
                title: 'Unidad De Sercicio eliminada'
              });
            } else {
              alertError.fire({
                title: 'Eliminar Unidad De Servicio',
                text:
                  'No se ha podido eliminar la Unidad De Servicio, intentalo nuevamente'
              });
            }
          });
        }
      });
  }

  copiar(elementId: any) {
    // Create an auxiliary hidden input
    const element = document.createElement('input');

    // Get the text from the element passed into the input
    element.setAttribute('value', document.getElementById(elementId).innerHTML);

    // Append the aux input to the body
    document.body.appendChild(element);

    // Highlight the content
    element.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the input from the body
    document.body.removeChild(element);
    this.snackBar$.open('Copiado al portapapeles', 'Cerrar', {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  }
}
