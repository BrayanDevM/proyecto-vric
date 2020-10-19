import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit {
  texto = 'Cargando algunas cosas...';

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.texto = 'Ya casi termina...';
    }, 6000);
    setTimeout(() => {
      this.texto = 'Sólo unos segundos más...';
    }, 15000);
  }
}
