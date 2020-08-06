import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contrato } from 'src/app/models/contrato.model';
import { Uds } from 'src/app/models/uds.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContratosService } from 'src/app/services/contratos.service';
import { UdsService } from 'src/app/services/uds.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgOption } from '@ng-select/ng-select';
import { alertSuccess, alertError } from 'src/app/helpers/swal2.config';
import { Router } from '@angular/router';
declare var moment: any;

@Component({
  selector: 'app-crear-contrato',
  templateUrl: './crear-contrato.component.html',
  styleUrls: ['./crear-contrato.component.css']
})
export class CrearContratoComponent implements OnInit {
  // datos ng-select -----------------------------
  estadoContrato: NgOption[] = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];
  // ----------------------------------------------
  contrato: Contrato;
  // Arreglo de uds enContrato = null
  udsDisponibles: Uds[] = [];
  // IDs para pasar por formulario
  IdUdsSeleccionadas: string[] = [];
  // Uds seleccionadas para mostrar en tabla
  udsEnContrato: Uds[] = [];
  cargandoUdsDisponibles = false;
  formContrato: FormGroup;
  creando = false;
  @Output() nuevoContrato: EventEmitter<any> = new EventEmitter();

  constructor(
    public contrato$: ContratosService,
    public uds$: UdsService,
    private usuario$: UsuarioService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formContrato = this.fb.group({
      codigo: [null, Validators.required],
      cupos: [null, Validators.required],
      regional: [null, Validators.required],
      cz: [null, Validators.required],
      eas: [null, Validators.required],
      nit: [null, Validators.required],
      activo: false
    });
  }

  get fv() {
    return this.formContrato.value;
  }

  ngOnInit() {
    this.obtenerUdsDisponibles();
  }

  cancelar() {
    this.router.navigate(['/contratos']);
  }

  obtenerUdsDisponibles() {
    this.cargandoUdsDisponibles = true;
    this.uds$.obtenerUds('enContrato=null').subscribe((resp: any) => {
      if (resp.ok) {
        this.udsDisponibles = resp.uds;
        this.cargandoUdsDisponibles = false;
      } else {
        this.cargandoUdsDisponibles = false;
      }
    });
  }

  agregarUdsContrato(event: any) {
    // obtengo datos de la Unidad en arreglo
    const UdsSeleccionada = this.udsDisponibles.find(
      (unidad: Uds) => unidad._id === event._id
    );
    // obtenfo indice de la Unidad en arreglo
    const i = this.udsDisponibles.findIndex(
      (unidad: any) => unidad._id === event._id
    );
    // Agrego id a selección
    this.IdUdsSeleccionadas.push(event._id);
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

  crearContrato() {
    this.creando = true;
    if (this.formContrato.invalid) {
      this.creando = false;
      return;
    }
    // Guardo datos en nueva variable, así no reemplaza las UDS en this.contrato para visualizar
    const contrato = new Contrato(
      this.formContrato.value.codigo,
      this.formContrato.value.cupos,
      this.formContrato.value.eas,
      this.formContrato.value.nit,
      this.formContrato.value.regional,
      this.formContrato.value.cz,
      this.usuario$.usuario._id,
      moment().format('DD/MM/YYYY'),
      this.formContrato.value.activo,
      this.IdUdsSeleccionadas
    );
    this.contrato$.crearContrato(contrato).subscribe((resp: any) => {
      if (resp.ok) {
        alertSuccess.fire({
          title: 'Contrato creado'
        });
        this.creando = false;
        this.contrato$.nuevoContrato$.emit(resp.contratoCreado);
        // this.formContrato.reset();
        this.router.navigate(['/contratos']);
        // this.router.navigate(['contratos', { outlets: { contrato: [resp.contratoCreado._id] } }]);
      } else {
        alertError.fire({
          title: 'Crear contrato',
          text: 'No se ha podido crear el contrato, intentalo nuevamente'
        });
        this.creando = false;
      }
    });
  }
}
