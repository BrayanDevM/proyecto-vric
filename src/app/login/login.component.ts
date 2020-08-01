import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: Usuario;
  formLogin: FormGroup;
  cargando = false;
  recordarCorreo = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.formLogin = this.fb.group({
      correo: [null, Validators.required],
      password: [null, Validators.required],
      recuerdame: false
    });
    if (localStorage.getItem('correo')) {
      const correo = localStorage.getItem('correo');
      this.formLogin.get('correo').patchValue(correo);
      this.formLogin.get('recuerdame').patchValue(!this.recordarCorreo);
    }
  }

  login() {
    this.cargando = true;
    if (this.formLogin.invalid) {
      this.cargando = false;
      return;
    }
    this.cargando = true;
    this.usuario = new Usuario(
      null,
      this.formLogin.value.correo,
      null,
      this.formLogin.value.password
    );

    this.usuarioService
      .login(this.usuario, this.formLogin.value.recuerdame)
      .subscribe(
        (resp: any) => {
          this.cargando = false;
        },
        (error: any) => {
          this.cargando = false;
          console.log(error);
        }
      );
  }

  googleLogin() {
    this.usuarioService.googleLogin();
  }
}
