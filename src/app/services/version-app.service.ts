import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config/config';
import { map } from 'rxjs/operators';
import { alertDanger } from '../helpers/swal2.config';

@Injectable({
  providedIn: 'root'
})
export class VersionAppService {
  API_URL = Config.REST.PRINCIPAL.URL + '/version';
  versionActual = '1.1.0';

  constructor(private http: HttpClient) {}

  obtenerVersionApp() {
    return this.http.get(this.API_URL).pipe(
      map((resp: any) => {
        if (resp.ok) {
          return resp.appVersion[0].frontend_version;
        }
      })
    );
  }

  compararVersion() {
    this.obtenerVersionApp().subscribe((version: string) => {
      console.log('versión actualizada: ', version);
      this.versionActual !== version ? this.recargarPagina(version) : null;
    });
  }

  recargarPagina(version: string) {
    console.log('hay una nueva versión!');
    alertDanger
      .fire({
        title: 'Hay una nueva actualización!',
        html: `Está disponible la nueva versión ${version}, actualmente te encuentras en la versión ${this.versionActual}`,
        confirmButtonText: 'Actualizar',
        showCancelButton: false
      })
      .then((resp: any) => {
        if (resp.value) {
          location.reload();
        }
      });
  }
}
