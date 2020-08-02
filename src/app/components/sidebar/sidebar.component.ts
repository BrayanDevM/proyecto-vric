import { Component, OnInit } from '@angular/core';
import { Reporte } from 'src/app/models/reportes.model';
import { ReportesService } from 'src/app/services/reportes.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
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
  reporte = new Reporte('Fallo', '', moment().format('DD/MM/YYYY'));

  constructor(
    private usuario$: UsuarioService,
    private sidebar$: SidebarService,
    private reporte$: ReportesService
  ) {}

  ngOnInit() {
    this.menuUsuario = this.sidebar$.obtenerMenu();
    this.usuario = this.usuario$.usuario;
  }

  cerrarSesion() {
    this.usuario$.logout();
  }

  crearReporte() {
    this.reporte$.crearReporte(this.reporte).subscribe((resp: any) => {
      console.log(resp);
      if (resp.ok === true) {
        Swal.fire({
          title: 'Reportar ingreso',
          html: `Reporte enviado al administrador, muchas gracias por tu tiempo`,
          icon: 'success'
        });
        jQuery('#modal-reporte').modal('hide');
        this.reporte = new Reporte('Fallo', '', moment().format('DD/MM/YYYY'));
      }
    });
  }
}
