import { Injectable, ViewChild, ElementRef } from '@angular/core';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  constructor(private usuarios$: UsuarioService) {}

  obtenerMenu() {
    return this.usuarios$.menu;
  }

  minimizarMenu(abierto: boolean) {
    const sidebar = document.querySelector('#app-sidebar');
    // const btnMenu = document.querySelector('#btn-menu');
    const menuicon = document.querySelector('#nav-icon');
    if (!abierto) {
      // btnMenu.classList.add('menu-open');
      menuicon.classList.remove('open');
      sidebar.classList.add('app-sidebar-min');
    } else {
      sidebar.classList.remove('app-sidebar-min');
      menuicon.classList.add('open');
      // btnMenu.classList.remove('menu-open');
    }
  }
}
