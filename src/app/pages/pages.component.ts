import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit, AfterViewInit {
  pantallaCompleta = false;
  appPagina: any;
  mode = 'side';

  constructor(private ngSelectConfig: NgSelectConfig) {
    this.ngSelectConfig.notFoundText = 'No se encontraron datos';
    this.ngSelectConfig.loadingText = 'Cargando...';
    this.appPagina = document.documentElement;
  }

  ngOnInit() {
    localStorage.removeItem('cerrarUpdateModal');
  }

  ngAfterViewInit() {}

  /* View in fullscreen */
  openFullscreen() {
    this.pantallaCompleta = true;
    if (this.appPagina.requestFullscreen) {
      this.appPagina.requestFullscreen();
    } else if (this.appPagina.mozRequestFullScreen) {
      /* Firefox */
      this.appPagina.mozRequestFullScreen();
    } else if (this.appPagina.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.appPagina.webkitRequestFullscreen();
    } else if (this.appPagina.msRequestFullscreen) {
      /* IE/Edge */
      this.appPagina.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    this.pantallaCompleta = false;
    document.exitFullscreen();
  }
}
