import { Injectable, EventEmitter, resolveForwardRef } from '@angular/core';
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
  // variables de uso
  usuario: Usuario;
  token: string;
  menu: any = [];

  // variables de API
  API_URL = Config.REST.PRINCIPAL.URL;

  // observables
  usuarioNuevo$ = new EventEmitter<Usuario>();
  usuarioEliminado$ = new EventEmitter<string>();
  usuarioActualizado$ = new EventEmitter<Usuario>();

  constructor(
    private http: HttpClient,
    private cookie$: CookieService,
    private router: Router
  ) {
    this.cargarCookies();
  }

  /**
   * Realiza petición POST para comprobar existencia de
   * usuario en la base de datos
   * @param usuario { correo, password }
   * @param recordar booleano
   */
  iniciarSesion(usuario: any, recordar: boolean) {
    // guarda en Local Storage o elimina correo
    this.guardarCorreoLS(usuario.correo, recordar);

    return this.http.post(`${this.API_URL}/login`, usuario).pipe(
      map((resp: any) => {
        // console.log(resp, '<- repsonse!');

        // Si usuario esta inactivado por admin lanza alerta y detiene ejecución
        if (!resp.usuario.activo) {
          alertError.fire(
            'Inicio de sesión',
            'Tu cuenta se encuentra inactiva, por favor contactar con el administrador.'
          );
          return false;
        } else {
          // asigna valores a variables
          this.usuario = resp.usuario;
          this.token = resp.token;
          this.menu = resp.menu;

          this.crearCookieSesion(this.token, this.usuario, this.menu);

          // Si usuario es docente envía a Dashboard de su uds (primera, en caso de varias)
          this.usuario.rol === 'DOCENTE'
            ? this.router.navigate(['/dashboard/uds', this.usuario.uds[0]])
            : this.router.navigate(['/dashboard']);

          return true;
        }
      }),
      catchError((err) => {
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

  /**
   * Inicio de sesión con Google en Auth0
   */
  googleLogin() {
    // definimos la anchura y altura de la ventana
    const altura = 550;
    const anchura = 470;
    // calculamos la posicion x e y para centrar la ventana
    const y = window.screen.height / 2 - altura / 2;
    const x = window.screen.width / 2 - anchura / 2;

    window.open(
      `${this.API_URL}/login/google`,
      'Google Sign in',
      `width=${anchura},height=${altura},top=${y},left=${x},toolbar=no,scrollbars=no,resizable=no`
    );
    window.addEventListener('message', (message: any) => {
      // console.log(message.data);

      // asigna valores a variables
      this.usuario = message.data.usuario;
      this.token = message.data.token;
      this.menu = message.data.menu;

      this.crearCookieSesion(this.token, this.usuario, this.menu);

      // Si usuario es docente envía a Dashboard de su uds (primera, en caso de varias)
      this.usuario.rol === 'DOCENTE'
        ? this.router.navigate(['/dashboard/uds', this.usuario.uds[0]])
        : this.router.navigate(['/dashboard']);
    });
    return true;
  }

  /**
   * Purga todos los datos y redirecciona a Login
   */
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
    this.cookie$.check('usuario')
      ? (this.usuario = JSON.parse(this.cookie$.get('usuario')))
      : this.logout();

    this.cookie$.check('token')
      ? (this.token = this.cookie$.get('token'))
      : this.logout();

    this.cookie$.check('menu')
      ? (this.menu = JSON.parse(this.cookie$.get('menu')))
      : this.logout();
  }

  /**
   * Comprueba token y retorna boolean para already-login.guard.ts y login.guard.ts
   */
  haIniciadoSesion() {
    return this.cookie$.check('token') ? true : false;
  }

  obtenerUsuarios(query?: string) {
    if (!query) {
      return this.http.get(`${this.API_URL}/usuarios?token=${this.token}`).pipe(
        map((resp: any) => {
          if (resp.ok) {
            return resp.usuarios;
          }
        })
      );
    } else {
      return this.http.get(
        `${this.API_URL}/usuarios?${query}&token=${this.token}`
      );
    }
  }

  obtenerUsuarios_uds(query?: string) {
    if (!query) {
      return this.http.get(`${this.API_URL}/usuarios/uds?token=${this.token}`);
    } else {
      return this.http.get(
        `${this.API_URL}}/usuarios/uds?${query}&token=${this.token}`
      );
    }
  }

  obtenerUsuarios_contratos(query?: string) {
    if (!query) {
      return this.http.get(
        `${this.API_URL}/usuarios/contratos?token=${this.token}`
      );
    } else {
      return this.http.get(
        `${this.API_URL}/usuarios/contratos?${query}&token=${this.token}`
      );
    }
  }

  obtenerUsuarios_contratos_uds(query?: string) {
    if (!query) {
      return this.http.get(
        `${this.API_URL}/usuarios/contratos/uds?token=${this.token}`
      );
    } else {
      return this.http.get(
        `${this.API_URL}/usuarios/contratos/uds?${query}&token=${this.token}`
      );
    }
  }

  obtenerUsuario(id: string) {
    return this.http.get(`${this.API_URL}/usuarios/${id}?token=${this.token}`);
  }

  crearUsuario(form: any) {
    return this.http
      .post(`${this.API_URL}/usuarios?token=${this.token}`, form)
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
        catchError((err) => {
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
    const URL = `${this.API_URL}/usuarios/${usuario._id}?token=${this.token}`;
    return this.http.put(URL, usuario).pipe(
      map((resp: any) => {
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
    const URL = `${this.API_URL}/usuarios/${usuario._id}?token=${this.token}`;
    return this.http.delete(URL);
  }

  renovarToken() {
    const URL = `${this.API_URL}/renuevaToken?token=${this.token}`;
    return this.http.get(URL).pipe(
      map((resp: any) => {
        if (resp.ok) {
          this.token = resp.nuevoToken;
          this.crearCookieSesion(this.token, this.usuario, this.menu);
          return true;
        }
      }),
      catchError((err) => {
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

  guardarCorreoLS(correo: string, guardar: boolean) {
    guardar
      ? localStorage.setItem('correo', correo)
      : localStorage.removeItem('correo');
  }
}
