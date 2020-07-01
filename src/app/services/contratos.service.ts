import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../config/config';
import { Contrato } from '../models/contrato.model';
import { Usuario } from '../models/usuario.model';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  contratos: Contrato[];
  usuario: Usuario;
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + '/contratos';

  constructor(
    private usuario$: UsuarioService,
    private http: HttpClient,
    private router: Router
  ) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  obtenerContratos() {
    return this.http.get(this.API_URL + `?token=${this.token}`);
  }

  obtenerContrato(id: string) {
    return this.http.get(this.API_URL + `/${id}?token=${this.token}`);
  }

  crearContrato(contrato: Contrato) {
    return this.http.post(this.API_URL + `?token=${this.token}`, contrato).pipe(
      map((resp: any) => {
        if (resp.ok === true) {
          Swal.fire({
            title: 'Crear contrato',
            html: `El contrato <b>${contrato.codigo}</b> de <b>${contrato.eas}</b> ha sido creado correctamente`,
            icon: 'success'
          });
          this.router.navigate(['/contratos']);
          return resp;
        }
      }),
      catchError(err => {
        if (err.status === 400) {
          Swal.fire({
            title: 'Crear contrato',
            html: `${err.error.mensaje}.</br></br>Model: ${err.error.error.message} `,
            icon: 'error'
          });
        }
        return throwError(err);
      })
    );
  }

  actualizarContrato(contrato: Contrato) {
    return this.http
      .put(this.API_URL + `/${contrato._id}?token=${this.token}`, contrato)
      .pipe(
        map((resp: any) => {
          if (resp.ok === true) {
            Swal.fire({
              title: 'Actualizar contrato',
              html: `El contrato <b>${contrato.codigo}</b> de <b>${contrato.eas}</b> ha sido actualizado correctamente`,
              icon: 'success'
            });
            return resp;
          }
        })
      );
  }

  eliminarContrato(contrato: Contrato) {
    return this.http.delete(
      this.API_URL + `/${contrato._id}?token=${this.token}`
    );
  }
}
