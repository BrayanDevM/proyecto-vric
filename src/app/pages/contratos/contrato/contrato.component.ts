import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Contrato } from 'src/app/models/contrato.model';
import { ContratosService } from 'src/app/services/contratos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import {
  alertSuccess,
  alertDanger,
  alertError
} from 'src/app/helpers/swal2.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Config } from 'src/app/config/config';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class ContratoComponent implements OnInit {
  // selects
  estadoContrato: any[] = Config.SELECTS.centrosZonales;
  centrosZonales: any[] = Config.SELECTS.centrosZonales;
  regionales: any[] = Config.SELECTS.regionalesICBF;

  contrato: Contrato;
  // Arreglo de uds enContrato = contrato._id || null
  udsDisponibles: Uds[] = [];
  // IDs para pasar por formulario
  IdUdsSeleccionadas: string[] = [];
  // Uds seleccionadas para mostrar en tabla
  udsEnContrato = [];
  // --------------------------------
  cargandoUdsDisponibles = false;
  formActualizarContrato: FormGroup;

  // permisos
  puedeEditar = false;
  editMode = false;

  constructor(
    private usuario$: UsuarioService,
    public contratos$: ContratosService,
    public uds$: UdsService,
    private fb: FormBuilder,
    private snackBar$: MatSnackBar,
    private router: Router
  ) {
    this.comprobarPermisos();
    this.formActualizarContrato = this.fb.group({
      codigo: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      cupos: [null, Validators.required],
      regional: [null, Validators.required],
      cz: [null, Validators.required],
      eas: [null, Validators.required],
      nit: [null, Validators.required],
      activo: null
    });
    this.obtenerInfoRuta().subscribe(contratoId => {
      if (contratoId !== undefined) {
        this.obtenerContrato(contratoId)
          .then((contrato: Contrato) => {
            this.contrato = contrato;
            this.udsEnContrato = contrato.uds;
            this.obtenerIdUdsSeleccionadas(contrato.uds);
            this.actualizarForm(contrato);
            this.obtenerUdsDisponibles(contrato._id);
            this.editMode = false;
          })
          .catch(error => console.log(error));
      }
    });
  }

  get fv() {
    return this.formActualizarContrato.value;
  }
  get fc() {
    return this.formActualizarContrato.controls;
  }

  ngOnInit() {}

  obtenerInfoRuta(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.params.contratoId)
    );
  }

  volver() {
    this.router.navigate(['/contratos']);
  }

  obtenerContrato(id: string) {
    return new Promise((resolve, reject) => {
      this.contratos$.obtenerContrato(id).subscribe((resp: any) => {
        if (resp.ok) {
          resolve(resp.contrato);
        } else {
          reject(resp);
        }
      });
    });
  }

  actualizarForm(contrato: Contrato) {
    this.formActualizarContrato.setValue({
      codigo: contrato.codigo,
      cupos: contrato.cupos,
      regional: contrato.regional,
      cz: contrato.cz,
      eas: contrato.eas,
      nit: contrato.nit,
      activo: contrato.activo
    });
  }

  obtenerIdUdsSeleccionadas(uds: Uds[]) {
    uds.forEach(unidad => {
      this.IdUdsSeleccionadas.push(unidad._id);
    });
  }

  obtenerUdsDisponibles(contratoId: string) {
    this.cargandoUdsDisponibles = true;
    this.uds$
      .obtenerUds(`enContrato=null+${contratoId}`)
      .subscribe((resp: any) => {
        if (resp.ok) {
          // Obtengo todas las UDS disponibles (las del contrato y null);
          this.udsDisponibles = resp.uds;
          // Para cada unidad que está en contrato ['_id']
          this.IdUdsSeleccionadas.forEach(udsId => {
            // obtengo index en disponibles
            const i = this.udsDisponibles.findIndex(
              unidad => unidad._id === udsId
            );
            if (i > -1) {
              // Elimino uds ya en contrato de las disponibles
              this.udsDisponibles.splice(i, 1);
            }
          });
          this.cargandoUdsDisponibles = false;
        } else {
          this.cargandoUdsDisponibles = false;
        }
      });
  }

  agregarUdsContrato(event: any) {
    // obtengo datos de la Unidad en arreglo
    const UdsSeleccionada: any = this.udsDisponibles.find(
      (unidad: Uds) => unidad._id === event.value
    );
    const i = this.udsDisponibles.findIndex(
      (unidad: Uds) => unidad._id === event.value
    );
    // Agrego id a selección
    this.IdUdsSeleccionadas.push(event.value);
    // Agrego datos de UDS para mostrar
    this.udsEnContrato.unshift(UdsSeleccionada);
    // Elimino de las disponibles
    this.udsDisponibles.splice(i, 1);
    // Refreso arreglo para el select
    this.udsDisponibles = [...this.udsDisponibles];
  }

  sacarUdsContrato(index: number, unidadId: string) {
    // Obtengo indice de la Unidad en las seleccionadas
    const i = this.IdUdsSeleccionadas.findIndex(
      (unidad: any) => unidad === unidadId
    );
    // La agrego nuevamente como disponible en listado
    this.udsDisponibles.push(this.udsEnContrato[index]);
    // Refreso arreglo para el select
    this.udsDisponibles = [...this.udsDisponibles];
    // La elimino de la vista
    this.udsEnContrato.splice(index, 1);
    // La elimino de las seleccionadas
    this.IdUdsSeleccionadas.splice(i, 1);
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

  actualizar() {
    if (this.formActualizarContrato.invalid) {
      return;
    }
    // Guardo datos en nueva variable, así no reemplaza las UDS en this.contrato para visualizar
    const contrato = new Contrato(
      this.formActualizarContrato.value.codigo,
      this.formActualizarContrato.value.cupos,
      this.formActualizarContrato.value.eas,
      this.formActualizarContrato.value.nit,
      this.formActualizarContrato.value.regional,
      this.formActualizarContrato.value.cz,
      this.contrato.creadoPor,
      this.contrato.creadoEl,
      this.formActualizarContrato.value.activo,
      this.udsEnContrato,
      this.contrato._id
    );
    this.contratos$.actualizarContrato(contrato).subscribe((resp: any) => {
      if (resp.ok) {
        this.contrato = resp.contratoActualizado;
        this.contratos$.contratoActualizado$.emit(this.contrato);
        this.obtenerIdUdsSeleccionadas(resp.contratoActualizado.uds);
        this.actualizarForm(resp.contratoActualizado);
        this.obtenerUdsDisponibles(resp.contratoActualizado._id);
        this.editMode = false;
        alertSuccess.fire('Contrato actualizado');
      } else {
        this.editMode = false;
      }
    });
  }

  eliminarContrato(contrato: Contrato) {
    alertDanger
      .fire({
        title: 'Eliminar contrato',
        html: `¿Estás seguro que deseas eliminar el contrato <b>${contrato.codigo}</b>?, esta acción no puede deshacerse`,
        confirmButtonText: 'Estoy seguro, eliminar'
      })
      .then(result => {
        if (result.value) {
          this.contratos$.eliminarContrato(contrato).subscribe((resp: any) => {
            if (resp.ok) {
              alertSuccess.fire('Contrato eliminado');
              this.contratos$.contratoEliminado$.emit(contrato._id);
              this.router.navigate(['/contratos']);
            } else {
              alertError.fire({
                title: 'Eliminar contrato',
                text:
                  'No se ha podido eliminar el contrato, intentalo nuevamente'
              });
            }
          });
        }
      });
  }

  // permisos para crear
  comprobarPermisos() {
    switch (this.usuario$.usuario.rol) {
      case 'ADMIN':
        this.puedeEditar = true;
        break;
      case 'GESTOR':
        this.puedeEditar = true;
        break;
      default:
        this.puedeEditar = false;
        break;
    }
  }
}
