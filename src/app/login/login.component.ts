import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  // variables de uso
  usuario: any;
  formLogin: FormGroup;

  // variables de ux
  cargando = false;
  verPassword = false;
  recordarCorreo = false;
  iconoGoogle: string = '../assets/img/iconos/google.svg';

  constructor(
    private fb: FormBuilder,
    private usuario$: UsuarioService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    // Registro de icono Google
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.iconoGoogle)
    );

    // seteo de formulario reactivo
    this.formLogin = this.fb.group({
      correo: ['', Validators.required],
      password: ['', Validators.required],
      recuerdame: false
    });
  }

  get flv() {
    return this.formLogin.value;
  }

  ngOnInit() {
    this.compruebaRecordarCorreo();
  }

  /**
   * Comprueba en local storage si el usuario ha solicitado
   * recordar el correo para iniciar sesión rápidamente
   */
  compruebaRecordarCorreo() {
    if (localStorage.getItem('correo')) {
      const correoGuardado = localStorage.getItem('correo');
      this.formLogin.get('correo').patchValue(correoGuardado);
      this.formLogin.get('recuerdame').patchValue(true);
    }
  }

  /**
   * Comprueba formulario válido e inicia sesión con servicio
   */
  iniciarSesion() {
    if (this.formLogin.invalid) {
      return;
    } else {
      this.cargando = true;

      this.usuario = {
        correo: this.flv.correo,
        password: this.flv.password
      };

      this.usuario$
        .iniciarSesion(this.usuario, this.flv.recuerdame)
        .subscribe((resp) => (this.cargando = false));
    }
  }

  /**
   * Inicio de sesión con Google en Auth0
   */
  googleLogin() {
    this.usuario$.googleLogin();
  }

  /**
   * Abre modal con componente AcercaDe
   */
  acercaDe() {
    this.dialog.open(DialogAcercaDeComponent, {
      width: '620px'
    });
  }
}
