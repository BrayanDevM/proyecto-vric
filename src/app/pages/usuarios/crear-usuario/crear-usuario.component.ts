import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import { UdsService } from 'src/app/services/uds.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgOption } from '@ng-select/ng-select';
import { alertConfirm } from 'src/app/helpers/swal2.config';
import { Router } from '@angular/router';
declare var moment: any;

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  // data ng-select
  roles: NgOption = [
    {
      value: 'ADMIN',
      label: 'Administrador',
      icon: 'fas fa-user-shield text-danger'
    },
    { value: 'GESTOR', label: 'Gestor', icon: 'fas fa-user text-success' },
    {
      value: 'COORDINADOR',
      label: 'Coordinador',
      icon: 'fas fa-user text-primary'
    },
    { value: 'DOCENTE', label: 'Docente', icon: 'fas fa-user text-secondary' }
  ];
  // ---------------------
  formUsuario: FormGroup;
  creandoUsuario = false;
  contratosDisponibles: Contrato[] = [];
  cargandoContratos = false;
  verPassword = 'password';
  correoExiste = false;
  hide = true;

  @ViewChild('password', { static: true }) iPasword: ElementRef;

  constructor(
    private fb: FormBuilder,
    private contratos$: ContratosService,
    private router: Router,
    private usuarios$: UsuarioService
  ) {}

  ngOnInit() {
    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required],
      documento: ['', Validators.required],
      correo: ['', Validators.required],
      telefono: '',
      rol: null,
      contratos: null,
      uds: [],
      password: ['', Validators.required],
      activo: false,
      creadoEl: ''
    });

    this.obtenerContratos();
  }

  get fv(): any {
    return this.formUsuario.value;
  }

  cancelar() {
    this.router.navigate(['usuarios']);
  }

  obtenerContratos() {
    this.cargandoContratos = true;
    this.contratos$.obtenerContratos().subscribe((contratos: Contrato[]) => {
      this.contratosDisponibles = contratos;
    });
  }

  crearUsuario() {
    if (this.formUsuario.invalid) {
      return;
    }
    this.formUsuario.value.creadoEl = moment().format('YYYY-MM-DD');
    alertConfirm
      .fire({
        title: 'Usuarios',
        html: `¿Estas seguro de crear al usuario ${this.formUsuario.value.nombre}?`,
        confirmButtonText: 'Crear usuario'
      })
      .then((result: any) => {
        if (result.value) {
          this.creandoUsuario = true;
          this.usuarios$
            .crearUsuario(this.formUsuario.value)
            .subscribe((resp: any) => {
              this.usuarios$.usuarioNuevo$.emit(resp.usuarioCreado);
              this.formUsuario.reset();
            });
        }
      });
  }
}
