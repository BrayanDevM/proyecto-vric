import { Injectable, EventEmitter } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Config } from '../config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  usuario: Usuario;
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + '/main-dashboard';

  constructor(private usuario$: UsuarioService, private http: HttpClient) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  /**
   * Consulta las UDS por defecto, opcionalmente se puede enviar
   * una consulta con criterios especificos para las propiedades de una
   * UDS: (enContrato, arriendo='si/no', coordinador, gestor, docentes, cupos)
   */
  obtenerUds_beneficiarios(query?: string) {
    // if (!query) {
    //   return this.http.get(this.API_URL + `?token=${this.token}`).pipe(
    //     map((resp: any) => {
    //       if (resp.ok) {
    //         return resp.uds;
    //       }
    //     })
    //   );
    // } else {
    return this.http.get(this.API_URL + `?${query}&token=${this.token}`);
    // }
  }
}
