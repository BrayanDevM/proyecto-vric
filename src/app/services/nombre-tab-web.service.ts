import { Injectable } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class NombreTabWebService {
  titulo = 'Proyecto VRIC';

  constructor(private router: Router, public tituloPagina: Title) {
    this.obtenerInfoRuta().subscribe((data: any) => {
      if (data.nombrePagina !== 'Login') {
        this.titulo = 'VRIC | ' + data.nombrePagina;
        this.tituloPagina.setTitle(this.titulo);
      } else {
        this.titulo = 'Proyecto VRIC';
        this.tituloPagina.setTitle(this.titulo);
      }
    });
  }

  obtenerInfoRuta(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }
}
