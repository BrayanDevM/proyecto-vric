import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Contrato } from 'src/app/models/contrato.model';
import { ContratosService } from 'src/app/services/contratos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'app-contrato',
  templateUrl: './contrato.component.html',
  styleUrls: ['./contrato.component.css']
})
export class ContratoComponent implements OnInit, AfterViewInit {
  contrato: Contrato;
  udsEnContrato: any;
  udsDisponibles: Uds[] = [];
  formActualizarContrato: FormGroup;

  constructor(
    private rutaActual: ActivatedRoute,
    public contrato$: ContratosService,
    public uds$: UdsService,
    private usuario$: UsuarioService,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit() {
    jQuery('.selectpicker').selectpicker();
  }

  ngOnInit() {
    this.contrato = new Contrato(0, 0, '', '', '', '', '');
    // obtengo id de la ruta
    this.obtenerContrato();
    this.obtenerUds();

    this.formActualizarContrato = this.fb.group({
      codigo: [this.contrato.codigo, Validators.required],
      cupos: [null, Validators.required],
      regional: [null, Validators.required],
      cz: [null, Validators.required],
      eas: [null, Validators.required],
      nit: [null, Validators.required],
      activo: null
    });

    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, 350);
  }

  obtenerContrato() {
    this.rutaActual.params.subscribe((resp: Params) => {
      this.contrato$.obtenerContrato(resp.id).subscribe((contrato: any) => {
        this.contrato = contrato.contrato;
        const arreglo = [];
        this.contrato.uds.forEach((unidad: Uds) => {
          arreglo.push(unidad._id);
        });
        this.udsEnContrato = arreglo;
      });
    });
  }

  obtenerUds() {
    this.uds$.obtenerUds().subscribe((resp: any) => {
      // obtengo todas las UDS para mostrar en <select>
      const unidadesDisponibles = [];
      resp.uds.forEach((unidad: Uds) => {
        // Omito slas unidades que tienen otros contratos
        if (
          unidad.enContrato === this.contrato._id ||
          unidad.enContrato === null
        ) {
          unidadesDisponibles.push(unidad);
        }
      });
      this.udsDisponibles = unidadesDisponibles;
      // Tomo cada UDS dentro del contrato
      this.contrato.uds.forEach((unidad: Uds) => {
        const index: number = this.udsDisponibles.findIndex(
          (uds: any) => uds._id === unidad._id
        );
        /**
         * Toma el índice y lo elimina de todas las UDS
         * Así el <select> mostrará todas las UDS menos las
         * que ya están dentro del constrato
         */
        this.udsDisponibles.splice(index, 1);
      });
      // console.log('UDS Disponibles', this.udsDisponibles);
    });
  }

  agregarUdsContrato(event: any) {
    // Agrego _id de UDS seleccionada para enviar en PUT
    this.udsEnContrato.push(event.target.value);
    // Busco el objeto en las UDS disponibles y lo agrego al contrato.uds para visualizar en DOM
    const agregarUds: any = this.udsDisponibles.find(
      (unidad: any) => unidad._id === event.target.value
    );
    this.contrato.uds.push(agregarUds);
    // Pendiente construír objeto para enviar a actualizar
    this.refrescarSelect();
  }

  sacarUdsContrato(index: number, unidadId: string) {
    // splice me permite borrar el indice que indique y la cantidad de elementos
    this.contrato.uds.splice(index, 1);
    // Busco ese id en el arreglo independiente y lo elimino también
    const posicion: number = this.udsEnContrato.findIndex(
      (unidad: any) => unidad === unidadId
    );
    this.udsEnContrato.splice(posicion, 1);
    this.refrescarSelect();
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

  refrescarSelect() {
    // Vuelvo a obtenerlas todas para que esté disponible en <select>
    this.obtenerUds();
    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, 350);
  }
}
