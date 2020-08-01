import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import { NgSelectConfig } from '@ng-select/ng-select';
declare var jQuery: any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit, AfterViewInit {
  constructor(
    private sidebar$: SidebarService,
    private ngSelectConfig: NgSelectConfig
  ) {
    this.ngSelectConfig.notFoundText = 'No se encontraron datos';
    this.ngSelectConfig.loadingText = 'Cargando...';
  }

  ngOnInit() {
    localStorage.removeItem('cerrarUpdateModal');
  }

  ngAfterViewInit() {
    this.autoMinSidebar();
    this.mostrarModalActualizaciones();
  }

  autoMinSidebar(): void {
    if (screen.width <= 1024) {
      setTimeout(() => {
        this.sidebar$.minimizarMenu(true);
      }, 500);
    }
  }

  mostrarModalActualizaciones() {
    const modalVisto = localStorage.getItem('cerrarUpdateModal-v1.5.1');
    if (modalVisto === 'true') {
      return;
    } else {
      jQuery('#modalActualizaciones').modal('show');
    }
  }
}
