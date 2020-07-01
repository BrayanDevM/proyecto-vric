import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  constructor(private usuarios$: UsuarioService) {}

  obtenerMenu() {
    return this.usuarios$.menu;
  }
}
