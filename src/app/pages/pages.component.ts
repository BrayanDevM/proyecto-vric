import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { PageLoadingService } from '../services/page-loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit, AfterViewInit {
  pantallaCompleta = false;
  appPagina: any;
  mode = 'side';

  subPageLoading: Subscription;
  showLoadingPage = true;

  constructor(
    private pageLoading$: PageLoadingService,
    private ngSelectConfig: NgSelectConfig
  ) {
    this.ngSelectConfig.notFoundText = 'No se encontraron datos';
    this.ngSelectConfig.loadingText = 'Cargando...';
    this.appPagina = document.documentElement;
  }

  ngOnInit() {
    localStorage.removeItem('cerrarUpdateModal');
    this.subsPageLoading();
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

  subsPageLoading() {
    this.subPageLoading = this.pageLoading$.loadingDashboard.subscribe(
      (resp: boolean) => {
        this.showLoadingPage = resp;
        this.subPageLoading.unsubscribe();
      }
    );
  }
}
