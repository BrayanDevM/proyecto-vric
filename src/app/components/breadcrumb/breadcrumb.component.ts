import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  titulos = [];
  partes = [];
  paginaActiva = '';
  gIcono = 'create';

  constructor(private router: Router, public tituloPagina: Title) {
    this.obtenerInfoRuta().subscribe(data => {
      // console.log('data', data);
      data.partes.forEach((parte: string) => {
        this.partes.push(parte);
      });
      this.paginaActiva = data.paginaActiva;
      this.gIcono = data.gIcono;
      this.tituloPagina.setTitle('VRIC | ' + this.paginaActiva);
    });
  }

  obtenerInfoRuta(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }
  ngOnInit() {}
}
