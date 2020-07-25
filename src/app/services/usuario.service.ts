import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Config } from '../config/config';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { alertError } from '../helpers/swal2.config';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any = [];
  API_URL = Config.REST.PRINCIPAL.URL;

  constructor(
    private http: HttpClient,
    private cookie$: CookieService,
    private router: Router
  ) {
    this.cargarCookies();
  }

  login(usuario: Usuario, recordar: boolean) {
    if (recordar) {
      localStorage.setItem('correo', usuario.correo);
    } else {
      localStorage.removeItem('correo');
    }

    return this.http.post(this.API_URL + '/login', usuario).pipe(
      map((resp: any) => {
        if (!resp.usuario.activo) {
          alertError.fire({
            title: 'Inicio de sesión',
            text:
              'Tu cuenta se encuentra inactiva, por favor contactar con el administrador.'
          });
          return;
        }
        this.usuario = resp.usuario;
        this.token = resp.token;
        this.menu = resp.menu;
        this.crearCookieSesion(this.token, this.usuario, this.menu);
        this.router.navigate(['/dashboard']);
        return true;
      }),
      catchError(err => {
        console.log('Error en la petición', err);
        if (err.status === 400) {
          alertError.fire({
            title: 'Inicio de sesión',
            text: err.error.mensaje
          });
        }
        return throwError(err);
      })
    );
  }

  googleLogin() {
    // definimos la anchura y altura de la ventana
    const altura = 550;
    const anchura = 470;
    // calculamos la posicion x e y para centrar la ventana
    const y = window.screen.height / 2 - altura / 2;
    const x = window.screen.width / 2 - anchura / 2;

    window.open(
      this.API_URL + '/login/google',
      'Google Sign in',
      `width=${anchura},height=${altura},top=${y},left=${x},toolbar=no,scrollbars=no,resizable=no`
    );
    window.addEventListener('message', (message: any) => {
      // console.log(message.data);
      this.usuario = message.data.usuario;
      this.token = message.data.token;
      this.menu = message.data.menu;
      this.crearCookieSesion(this.token, this.usuario, this.menu);
      this.router.navigate(['/dashboard']);
    });
    return true;
  }

  logout() {
    this.token = '';
    this.usuario = null;
    this.menu = [];
    this.cookie$.deleteAll();
    localStorage.removeItem('udsAsignadas');
    localStorage.removeItem('datosDashboard');
    this.router.navigate(['/login']);
  }

  crearCookieSesion(token: string, usuario: Usuario, menu: any) {
    this.cookie$.set('token', token);
    this.cookie$.set('usuario', JSON.stringify(usuario));
    this.cookie$.set('menu', JSON.stringify(menu));
  }

  cargarCookies() {
    if (this.cookie$.check('usuario')) {
      this.usuario = JSON.parse(this.cookie$.get('usuario'));
    } else {
      this.logout();
    }
    if (this.cookie$.check('token')) {
      this.token = this.cookie$.get('token');
    } else {
      this.logout();
    }
    if (this.cookie$.check('menu')) {
      this.menu = JSON.parse(this.cookie$.get('menu'));
    } else {
      this.logout();
    }
  }

  haIniciadoSesion() {
    return this.cookie$.check('token') ? true : false;
  }

  obtenerUsuarios() {
    return this.http.get(this.API_URL + `/usuarios?token=${this.token}`);
  }

  obtenerUsuario(id: string) {
    return this.http.get(this.API_URL + `/usuarios/${id}?token=${this.token}`);
  }

  crearUsuario(form: any) {
    return this.http
      .post(this.API_URL + `/usuarios?token=${this.token}`, form)
      .pipe(
        map((resp: any) => {
          if (resp.ok === true) {
            Swal.fire({
              title: 'Usuario',
              text: resp.mensaje,
              icon: 'success'
            });
            return resp;
          }
        }),
        catchError(err => {
          Swal.fire({
            title: 'Usuario',
            html: `${err.error.mensaje} <br> ${err.error.error.message}`,
            icon: 'error'
          });
          return throwError(err);
        })
      );
  }

  actualizarUsuario(usuario: Usuario) {
    const URL = this.API_URL + `/usuarios/${usuario._id}?token=${this.token}`;
    return this.http.put(URL, usuario).pipe(
      map((resp: any) => {
        Swal.fire({
          title: 'Usuario',
          text: resp.mensaje,
          icon: 'success'
        });
        if (usuario._id === this.usuario._id) {
          this.crearCookieSesion(
            this.token,
            resp.usuarioActualizado,
            this.menu
          );
        }
        return resp;
      })
    );
  }

  eliminarUsuario(usuario: Usuario) {
    const URL = this.API_URL + `/usuarios/${usuario._id}?token=${this.token}`;
    return this.http.delete(URL).pipe(
      map((resp: any) => {
        if (resp.ok === true) {
          Swal.fire({
            title: 'Usuario',
            text: resp.mensaje,
            icon: 'success'
          });
          return true;
        } else {
          console.log('error serv', resp);
          return resp;
        }
      }),
      catchError(err => {
        Swal.fire({
          title: 'Usuario',
          text: err.error.mensaje,
          icon: 'error'
        });
        return throwError(err);
      })
    );
  }

  renovarToken() {
    const URL = this.API_URL + `/renuevaToken?token=${this.token}`;
    return this.http.get(URL).pipe(
      map((resp: any) => {
        if (resp.ok) {
          this.token = resp.nuevoToken;
          this.crearCookieSesion(this.token, this.usuario, this.menu);
          return true;
        }
      }),
      catchError(err => {
        Swal.fire({
          title: 'Su sesión ha expirado',
          html: `Ha expirado tu sesión o no ha sido posible renovar la misma, por favor intenta ingresar nuevamente`,
          icon: 'info'
        });
        this.logout();
        return throwError(err);
      })
    );
  }
}
