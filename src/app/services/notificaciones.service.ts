import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  token: string;
  API_URL = Config.REST.PRINCIPAL.URL + '/notificaciones';

  notificacionesSinLeer = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {}

  obtenerNotificaciones(usuarioId: string) {
    return this.http.get(this.API_URL + `?usuarioId=${usuarioId}`);
  }
}
