import { Injectable, EventEmitter } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Uds } from '../models/uds.model';
import { Config } from '../config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UdsService {
  uds: Uds[];
  usuario: Usuario;
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + '/uds';

  udsNueva$ = new EventEmitter<Uds>();
  udsEliminada$ = new EventEmitter<string>();
  udsActualizada$ = new EventEmitter<Uds>();

  constructor(private usuario$: UsuarioService, private http: HttpClient) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  /**
   * Consulta las UDS por defecto, opcionalmente se puede enviar
   * una consulta con criterios especificos para las propiedades de una
   * UDS: (enContrato, arriendo='si/no', coordinador, gestor, docentes, cupos)
   */
  obtenerUds(query = '') {
    if (!query) {
      return this.http.get(`${this.API_URL}?token=${this.token}`).pipe(
        map((resp: any) => {
          if (resp.ok) {
            return resp.uds;
          }
        })
      );
    } else {
      return this.http.get(`${this.API_URL}?${query}&token=${this.token}`);
    }
  }

  obtenerUds_beneficiarios(query = '') {
    return this.http.get(
      `${this.API_URL}/beneficiarios?${query}&token=${this.token}`
    );
  }

  obtenerUds_beneficiarios_responsables(query = '') {
    return this.http.get(
      `${this.API_URL}/beneficiarios/responsables?${query}&token=${this.token}`
    );
  }

  obtenerUds_codigos(query = '') {
    return this.http.get(
      `${this.API_URL}/codigos?${query}&token=${this.token}`
    );
  }

  obtenerUnidad(id: string) {
    return this.http.get(`${this.API_URL}/${id}?token=${this.token}`);
  }

  obtenerUnidad_beneficiarios(id: string) {
    return this.http.get(
      `${this.API_URL}/${id}/beneficiarios?token=${this.token}`
    );
  }

  obtenerUnidad_beneficiarios_responsables(id: string) {
    return this.http.get(
      `${this.API_URL}/${id}/beneficiarios/responsables?token=${this.token}`
    );
  }

  crearUds(uds: Uds) {
    return this.http.post(`${this.API_URL}?token=${this.token}`, uds);
  }

  actualizarUds(uds: Uds) {
    return this.http.put(`${this.API_URL}/${uds._id}?token=${this.token}`, uds);
  }

  eliminarUds(uds: Uds) {
    return this.http.delete(`${this.API_URL}/${uds._id}?token=${this.token}`);
  }
}
