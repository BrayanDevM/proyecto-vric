import { Component, OnInit } from '@angular/core';
import { Reporte } from 'src/app/models/reportes.model';
import { ReportesService } from 'src/app/services/reportes.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
declare var moment: any;
declare var jQuery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  usuario: Usuario;
  usuarioRol: string;
  menuUsuario: any = [];

  constructor(
    private usuario$: UsuarioService,
    private sidebar$: SidebarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuUsuario = this.sidebar$.obtenerMenu();
    this.usuario = this.usuario$.usuario;
  }

  irAjustes(): void {
    this.router.navigate(['/ajustes']);
  }
  irAyuda(): void {
    this.router.navigate(['/ayuda']);
  }

  cerrarSesion(): void {
    this.usuario$.logout();
  }
}
