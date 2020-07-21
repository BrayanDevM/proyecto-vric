import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import { NgSelectConfig } from '@ng-select/ng-select';

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

  ngOnInit() {}

  ngAfterViewInit() {
    this.autoMinSidebar();
  }

  autoMinSidebar(): void {
    if (screen.width <= 1024) {
      setTimeout(() => {
        this.sidebar$.minimizarMenu(true);
      }, 500);
    }
  }
}
