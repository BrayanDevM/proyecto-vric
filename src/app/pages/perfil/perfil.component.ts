import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
import { debenCoincidir } from 'src/app/helpers/deben-coincidir.validator';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario;
  udsAsignadas: Uds[] = [];
  formPerfil: FormGroup;
  formPassword: FormGroup;
  cargando = false;
  verPassword = 'password';

  @ViewChild('password', { static: true }) iPassword: ElementRef;
  @ViewChild('correo', { static: true }) iCorreo: ElementRef;

  constructor(
    private usuario$: UsuarioService,
    private uds$: UdsService,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this.usuario = this.usuario$.usuario;
    // console.log(this.usuario);
    this.obtenerUds(this.usuario.uds);

    this.formPerfil = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      documento: [this.usuario.documento, Validators.required],
      correo: [this.usuario.correo, Validators.required],
      telefono: this.usuario.telefono
    });

    this.formPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmaPassword: ['', Validators.required]
    });
    this.formPassword.setValidators(
      debenCoincidir('password', 'confirmaPassword')
    );

    if (this.usuario.google) {
      this.iCorreo.nativeElement.disabled = 'disabled';
    }
  }

  get fp() {
    return this.formPassword.controls;
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

  actualizarPerfil() {
    if (this.formPerfil.invalid) {
      return;
    }
    this.cargando = true;
    this.usuario.nombre = this.formPerfil.value.nombre;
    this.usuario.documento = this.formPerfil.value.documento;
    this.usuario.correo = this.formPerfil.value.correo;
    this.usuario.telefono = this.formPerfil.value.telefono;
    this.usuario$
      .actualizarUsuario(this.usuario)
      .subscribe(() => (this.cargando = false));
  }

  verInputPassword() {
    if (this.verPassword === 'password') {
      this.verPassword = 'text';
    } else {
      this.verPassword = 'password';
    }
  }

  actualizarPassword() {
    if (this.formPassword.invalid) {
      // console.log(this.formPassword);
      return;
    }
    this.cargando = true;
    this.usuario.password = this.formPassword.value.password;
    this.usuario$.actualizarUsuario(this.usuario).subscribe(() => {
      this.cargando = false;
      this.formPassword.reset();
    });
  }
}
