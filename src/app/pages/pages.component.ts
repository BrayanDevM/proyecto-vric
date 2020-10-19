import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { NgSelectConfig } from '@ng-select/ng-select';
import { PageLoadingService } from '../services/page-loading.service';
import { TemaService } from '../services/tema.service';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit {
  pantallaCompleta = false;
  appPagina: any;

  sidenavMode = 'side';
  sidenavBackdrop = false;

  subPageLoading: Subscription;
  showLoadingPage = true;
  sidenavOpen = true;

  @ViewChild('searchToolbar') searchToolbar: ElementRef;
  searchToolarOpen = false;

  subColorTema: Subscription;

  constructor(
    private pageLoading$: PageLoadingService,
    private tema$: TemaService,
    private ngSelectConfig: NgSelectConfig,
    public overlayContainer: OverlayContainer
  ) {
    this.ngSelectConfig.notFoundText = 'No se encontraron datos';
    this.ngSelectConfig.loadingText = 'Cargando...';
    this.appPagina = document.documentElement;
    this.detectarPantalla();
  }

  ngOnInit() {
    localStorage.removeItem('cerrarUpdateModal');
    this.subsPageLoading();
  }

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

  // Detecta tamaño de pantalla y modifica sidebar
  detectarPantalla(): void {
    if (screen.width <= 1024) {
      this.sidenavMode = 'push';
      this.sidenavBackdrop = true;
      this.sidenavOpen = false;
    }
  }

  subsPageLoading() {
    this.subPageLoading = this.pageLoading$.loadingPages.subscribe(
      (resp: boolean) => {
        setTimeout(() => {
          this.showLoadingPage = resp;
        }, 2000);
        this.subPageLoading.unsubscribe();
      }
    );
  }
}
