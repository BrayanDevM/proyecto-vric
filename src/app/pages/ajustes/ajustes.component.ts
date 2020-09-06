import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { ValidarCoincidencia } from 'src/app/helpers/Validators/deben-coincidir.validator';
import { ValidarTelefono } from 'src/app/helpers/Validators/telefono-validator';
import { ValidarDocumento } from 'src/app/helpers/Validators/documento-validator';
import { alertSuccess } from 'src/app/helpers/swal2.config';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class AjustesComponent implements OnInit {
  usuario: Usuario;
  udsAsignadas: Uds[] = [];
  formPerfil: FormGroup;
  formPassword: FormGroup;
  verPassword = false;

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(
    private usuario$: UsuarioService,
    private uds$: UdsService,
    public fb: FormBuilder
  ) {
    this.usuario = this.usuario$.usuario;

    this.formPerfil = this.fb.group({
      nombre: ['', Validators.required],
      documento: ['', [Validators.required, ValidarDocumento]],
      correo: ['', Validators.required],
      telefono: ['', ValidarTelefono],
      rol: ''
    });
    this.formPerfil.get('rol').disable();

    this.formPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmaPassword: ['', [Validators.required, ValidarCoincidencia]]
    });
  }

  ngOnInit() {
    this.patchFormPerfil();
    this.obtenerUds(this.usuario.uds);
  }

  get fpc() {
    return this.formPerfil.controls;
  }
  get fpv() {
    return this.formPerfil.value;
  }

  get fsc() {
    return this.formPassword.controls;
  }
  get fsv() {
    return this.formPassword.value;
  }

  obtenerUds(uds: string[]) {
    const arreglo = [];
    this.usuario.uds.forEach(unidad => {
      this.uds$.obtenerUnidad(unidad).subscribe((resp: any) => {
        arreglo.push(resp.unidad);
      });
    });
    this.udsAsignadas = arreglo;
    // console.log('uds', this.udsAsignadas);
  }

  patchFormPerfil() {
    this.formPerfil.patchValue({
      nombre: this.usuario.nombre,
      documento: this.usuario.documento,
      correo: this.usuario.correo,
      telefono: this.usuario.telefono,
      rol: this.usuario.rol
    });
  }

  actualizarPerfil() {
    if (this.formPerfil.invalid) {
      return;
    }
    this.usuario.nombre = this.formPerfil.value.nombre;
    this.usuario.documento = this.formPerfil.value.documento;
    this.usuario.correo = this.formPerfil.value.correo;
    this.usuario.telefono = this.formPerfil.value.telefono;
    this.usuario$.actualizarUsuario(this.usuario).subscribe((resp: any) => {
      if (resp.ok) {
        alertSuccess.fire('Usuario actualizado');
      }
    });
  }

  actualizarPassword() {
    if (this.formPassword.invalid) {
      this.formPassword.markAllAsTouched();
      return;
    }
    this.usuario.password = this.formPassword.value.password;
    this.usuario$.actualizarUsuario(this.usuario).subscribe((resp: any) => {
      if (resp.ok) {
        alertSuccess.fire('Usuario actualizado');
        this.formGroupDirective.resetForm();
        this.patchFormPerfil();
      }
    });
  }
}
