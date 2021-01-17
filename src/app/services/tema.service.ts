import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface Ajustes {
  temaUrl: string;
  tema: string;
}

@Injectable({
  providedIn: 'root',
})
export class TemaService {
  ajustes: Ajustes = {
    temaUrl: 'assets/css/temas/vric-default-theme.css',
    tema: 'vric-default-theme',
  };

  constructor(@Inject(DOCUMENT) private document$) {
    this.cargarAjustes();
  }

  guardarAjustes() {
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }

  cargarAjustes() {
    if (localStorage.getItem('ajustes')) {
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      this.aplicarTema(this.ajustes.tema);
    }
  }

  aplicarTema(tema: string) {
    // Cambiamos css en index.html
    const rutaTema = `assets/css/temas/${tema}.css`;
    this.document$.querySelector('#cssTema').setAttribute('href', rutaTema);

    // #global-container
    document.body.className = '';
    document.body.classList.add('mat-typography');
    document.body.classList.add(tema);

    this.ajustes.tema = tema;
    this.ajustes.temaUrl = rutaTema;
    this.guardarAjustes();
  }
}
