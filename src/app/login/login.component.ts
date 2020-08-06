import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../models/usuario.model';
import { UsuarioService } from '../services/usuario.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { DialogAcercaDeComponent } from '../components/dialogs/dialog-acerca-de/dialog-acerca-de.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: Usuario;
  formLogin: FormGroup;
  hide = true;
  cargando = false;
  recordarCorreo = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/iconos/google.svg'
      )
    );
  }

  ngOnInit() {
    this.comprobarCorreo();
  }

  comprobarCorreo() {
    this.formLogin = this.fb.group({
      correo: [null, Validators.required],
      password: ['9315267070aA', Validators.required],
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

  acercaDe() {
    this.dialog.open(DialogAcercaDeComponent, {
      width: '620px'
    });
  }
}
