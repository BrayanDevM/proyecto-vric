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
  cargando: boolean;
  recordar = false;
  recordarCorreo: string;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.cargando = false;
    this.formLogin = this.fb.group({
      correo: [null, Validators.required],
      password: [null, Validators.required],
      recuerdame: false
    });
    if (localStorage.getItem('correo')) {
      this.recordarCorreo = localStorage.getItem('correo');
      this.recordar = true;
    }
  }

  login() {
    if (this.formLogin.invalid) {
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
        () => {
          this.cargando = false;
        },
        error => (this.cargando = false)
      );
  }

  googleLogin() {
    this.usuarioService.googleLogin();
  }
}
