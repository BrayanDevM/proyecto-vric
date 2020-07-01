import { Component, OnInit } from '@angular/core';
import { Reporte } from 'src/app/models/reportes.model';
import { ReportesService } from 'src/app/services/reportes.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var moment: any;
declare var jQuery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  usuarioRol: string;
  menu: any = [];
  reporte = new Reporte('Fallo', '', moment().format('DD/MM/YYYY'));

  constructor(
    private usuario$: UsuarioService,
    private sidebar$: SidebarService,
    private reporte$: ReportesService
  ) {}

  ngOnInit() {
    this.menu = this.sidebar$.obtenerMenu();
    this.usuarioRol = this.usuario$.usuario.rol;
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
