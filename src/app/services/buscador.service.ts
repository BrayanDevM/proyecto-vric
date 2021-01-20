import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {
  API_URL = Config.REST.PRINCIPAL.URL + '/buscar';

  constructor(private http: HttpClient) {}

  buscarTodos(criterio: string) {
    return this.http.get(`${this.API_URL}/todos/${criterio}`);
  }

  buscarEnColeccion(nombreColeccion: string, criterio: string) {
    return this.http.get(
      `${this.API_URL}/coleccion/${nombreColeccion}/${criterio}`
    );
  }
}
