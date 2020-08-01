import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Config } from '../config/config';
import { Contrato } from '../models/contrato.model';
import { Usuario } from '../models/usuario.model';
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

  obtenerContratos(query?: string) {
    if (!query) {
      return this.http.get(this.API_URL + `?token=${this.token}`).pipe(
        catchError(err => {
          return throwError(err);
        })
      );
    } else {
      return this.http.get(this.API_URL + `?${query}&token=${this.token}`).pipe(
        catchError(err => {
          return throwError(err);
        })
      );
    }
  }

  obtenerContratos_uds(query?: string) {
    if (!query) {
      return this.http.get(this.API_URL + `/uds?token=${this.token}`).pipe(
        catchError(err => {
          return throwError(err);
        })
      );
    } else {
      return this.http
        .get(this.API_URL + `/uds?${query}&token=${this.token}`)
        .pipe(
          catchError(err => {
            return throwError(err);
          })
        );
    }
  }

  obtenerContrato(id: string) {
    return this.http.get(this.API_URL + `/${id}?token=${this.token}`).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }

  crearContrato(contrato: Contrato) {
    return this.http.post(this.API_URL + `?token=${this.token}`, contrato).pipe(
      catchError(err => {
        return throwError(err);
      })
    );
  }

  actualizarContrato(contrato: Contrato) {
    return this.http
      .put(this.API_URL + `/${contrato._id}?token=${this.token}`, contrato)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      );
  }

  eliminarContrato(contrato: Contrato) {
    return this.http
      .delete(this.API_URL + `/${contrato._id}?token=${this.token}`)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      );
  }
}
