import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Reporte } from '../models/reportes.model';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  reportes: Reporte[];
  usuario: Usuario;
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + `/reportes`;

  constructor(private usuario$: UsuarioService, private http: HttpClient) {
    this.usuario = this.usuario$.usuario;
    this.token = this.usuario$.token;
  }

  obtenerReportes() {
    return this.http.get(this.API_URL + `?token=${this.token}`);
  }

  crearReporte(reporte: Reporte) {
    return this.http.post(this.API_URL + `?token=${this.token}`, reporte);
  }

  actualizarReporte(reporte: Reporte) {
    return this.http.put(
      this.API_URL + `/${reporte._id}?token=${this.token}`,
      reporte
    );
  }
}
