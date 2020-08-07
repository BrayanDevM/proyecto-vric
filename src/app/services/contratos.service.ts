import { Injectable, EventEmitter } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Config } from '../config/config';
import { Contrato } from '../models/contrato.model';
import { Usuario } from '../models/usuario.model';
import { map, catchError } from 'rxjs/operators';
import { throwError, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  contratos: Contrato[];
  usuario: Usuario;
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + '/contratos';

  // throw new Error('Error en consulta');      <-- Error lado del cliente
  // throw new HttpErrorResponse({              <-- Error lado servidor
  //   error: { mensaje: 'error en consulta' }
  // });

  // Emiten actualizaciones
  nuevoContrato$ = new EventEmitter<Contrato>();
  contratoEliminado$ = new EventEmitter<string>();

  constructor(private usuario$: UsuarioService, private http: HttpClient) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  obtenerContratos(query?: string) {
    if (!query) {
      return this.http.get(this.API_URL + `?token=${this.token}`).pipe(
        map((resp: any) => {
          if (resp.ok) {
            return resp.contratos;
          }
        })
      );
    } else {
      return this.http.get(this.API_URL + `?${query}&token=${this.token}`);
    }
  }

  obtenerContratos_uds(query?: string) {
    if (!query) {
      return this.http.get(this.API_URL + `/uds?token=${this.token}`);
    } else {
      return this.http.get(this.API_URL + `/uds?${query}&token=${this.token}`);
    }
  }

  obtenerContrato(id: string) {
    return this.http.get(this.API_URL + `/${id}?token=${this.token}`);
  }

  crearContrato(contrato: Contrato) {
    return this.http.post(this.API_URL + `?token=${this.token}`, contrato);
  }

  actualizarContrato(contrato: Contrato) {
    return this.http.put(
      this.API_URL + `/${contrato._id}?token=${this.token}`,
      contrato
    );
  }

  eliminarContrato(contrato: Contrato) {
    return this.http.delete(
      this.API_URL + `/${contrato._id}?token=${this.token}`
    );
  }
}
