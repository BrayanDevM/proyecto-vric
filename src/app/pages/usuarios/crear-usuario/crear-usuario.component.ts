import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import { UdsService } from 'src/app/services/uds.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgOption } from '@ng-select/ng-select';
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

  @ViewChild('password', { static: true }) iPasword: ElementRef;

  constructor(
    private fb: FormBuilder,
    private contratos$: ContratosService,
    private uds$: UdsService,
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
      creadoEl: ''
    });

    this.obtenerContratos();
  }

  obtenerContratos() {
    this.cargandoContratos = true;
    this.contratos$.obtenerContratos().subscribe((resp: any) => {
      if (resp.ok === true) {
        this.cargandoContratos = false;
        this.contratosDisponibles = resp.contratos;
      } else {
        this.cargandoContratos = false;
      }
    });
  }

  cambiarInputPassword() {
    if (this.verPassword === 'password') {
      this.verPassword = 'text';
    } else {
      this.verPassword = 'password';
    }
  }

  crearUsuario() {
    if (this.formUsuario.invalid) {
      return;
    }
    this.formUsuario.value.creadoEl = moment().format('YYYY-MM-DD');
    Swal.fire({
      title: 'Usuario',
      html: `¿Estas seguro de crear al usuario ${this.formUsuario.value.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear'
    }).then((result: any) => {
      if (result.value) {
        this.creandoUsuario = true;
        this.usuarios$
          .crearUsuario(this.formUsuario.value)
          .subscribe((resp: any) => {
            if (resp.ok) {
              this.creandoUsuario = false;
              this.formUsuario.reset();
              // console.log('respuesta backend: ', resp);
            } else {
              this.creandoUsuario = false;
            }
          });
      }
    });
  }
}
