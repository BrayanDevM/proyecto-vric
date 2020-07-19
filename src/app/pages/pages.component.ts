import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})
export class PagesComponent implements OnInit, AfterViewInit {
  constructor(private sidebar$: SidebarService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (screen.width <= 1024) {
      setTimeout(() => {
        this.sidebar$.minimizarMenu(true);
      }, 500);
    }
  }
}
