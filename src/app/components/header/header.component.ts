import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  usuario: Usuario;
  sidebarOpen = true;

  constructor(
    private sidebar$: SidebarService,
    private usuario$: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuario = this.usuario$.usuario;
    this.sidebar$.minimizarMenu(this.sidebarOpen);
  }

  logout() {
    this.usuario$.logout();
  }

  buscar(termino: any) {
    this.router.navigate(['/buscar', termino]);
  }

  minimizarSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebar$.minimizarMenu(this.sidebarOpen);
  }
}
