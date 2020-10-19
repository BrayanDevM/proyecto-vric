import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { alertSuccess } from 'src/app/helpers/swal2.config';
import { Config } from 'src/app/config/config';
declare const moment: any;

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  roles: any[] = Config.SELECTS.usuariosRoles;
  // ---------------------
  formUsuario: FormGroup;
  creandoUsuario = false;
  contratosDisponibles: Contrato[] = [];
  cargandoContratos = false;
  verPassword = 'password';
  correoExiste = false;
  hide = true;

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

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

    this.usuarios$
      .crearUsuario(this.formUsuario.value)
      .subscribe((resp: any) => {
        if (resp.ok) {
          alertSuccess.fire('Usuario creado');
          this.usuarios$.usuarioNuevo$.emit(resp.usuarioCreado);
          this.formGroupDirective.resetForm();
        }
      });
  }
}
