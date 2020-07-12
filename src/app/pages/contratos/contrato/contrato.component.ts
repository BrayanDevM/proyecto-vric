import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Contrato } from 'src/app/models/contrato.model';
import { ContratosService } from 'src/app/services/contratos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { NgOption } from '@ng-select/ng-select';
declare var moment: any;

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class ContratoComponent implements OnInit {
  // datos ng-select -----------------------------
  estadoContrato: NgOption[] = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];
  // ----------------------------------------------
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

  constructor(
    private rutaActual: ActivatedRoute,
    public contrato$: ContratosService,
    public uds$: UdsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.obtenerContrato();

    this.formActualizarContrato = this.fb.group({
      codigo: [null, Validators.required],
      cupos: [null, Validators.required],
      regional: [null, Validators.required],
      cz: [null, Validators.required],
      eas: [null, Validators.required],
      nit: [null, Validators.required],
      activo: null
    });
  }

  obtenerContrato() {
    this.rutaActual.params.subscribe((resp: Params) => {
      this.contrato$.obtenerContrato(resp.id).subscribe((contrato: any) => {
        // asigno contrato
        this.contrato = contrato.contrato;
        // asigno datos de uds en contrato para la vista
        this.udsEnContrato = this.contrato.uds;
        this.contrato.uds.forEach((unidad: Uds) => {
          // Tomo ids para actualizar
          this.IdUdsSeleccionadas.push(unidad._id);
        });
        this.obtenerUdsDisponibles();
      });
    });
  }

  obtenerUdsDisponibles() {
    this.cargandoUdsDisponibles = true;
    this.uds$
      .obtenerUdsDisponiblesPorContrato(this.contrato._id)
      .subscribe((resp: any) => {
        if (resp.ok) {
          // Obtengo todas las UDS disponibles (las del contrato y null);
          this.udsDisponibles = resp.udsDisponibles;
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
      (unidad: Uds) => unidad._id === event._id
    );
    const i = this.udsDisponibles.findIndex(
      (unidad: Uds) => unidad._id === event._id
    );
    // Agrego id a selección
    this.IdUdsSeleccionadas.push(event._id);
    // Agrego datos de UDS para mostrar
    this.udsEnContrato.push(UdsSeleccionada);
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

  actualizar() {
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
    this.contrato$.actualizarContrato(contrato).subscribe();
  }
}
