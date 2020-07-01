import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { Router } from '@angular/router';
import { Contrato } from 'src/app/models/contrato.model';
import { ContratosService } from 'src/app/services/contratos.service';
declare var jQuery: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  contratosDisponibles: Contrato[] = [];
  usuarioInfo: Usuario = null;
  cargando = false;

  constructor(
    private ususarios$: UsuarioService,
    private contratos$: ContratosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerUsuarios();
    // Pendiente selectpicker, no toma los valores ni refrescando (remuevo clase)
    // this.refrescarSelect(200);
  }

  obtenerUsuarios() {
    this.cargando = true;
    this.ususarios$.obtenerUsuarios().subscribe((resp: any) => {
      if (resp.ok === true) {
        this.usuarios = resp.usuarios;
        // console.log(resp.usuarios);
      } else {
        console.log('Error al traer usuarios', resp);
      }
      this.cargando = false;
    });
  }

  crearUsuario() {
    this.router.navigate(['/usuarios/crear']);
  }

  actualizarUsuario(usuario: Usuario) {
    this.ususarios$.actualizarUsuario(usuario).subscribe((resp: any) => {
      jQuery('#infoUsuario').modal({
        show: false
      });
      this.obtenerUsuarios();
    });
  }

  editarUsuario(usuario: Usuario) {
    usuario.password = '';
    this.contratos$.obtenerContratos().subscribe((resp: any) => {
      if (resp.ok === true) {
        this.contratosDisponibles = resp.contratos;
        this.usuarioInfo = usuario;
        jQuery('#infoUsuario').modal({
          show: true
        });
        this.refrescarSelect(150);
      }
    });
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario._id === this.ususarios$.usuario._id) {
      Swal.fire({
        title: 'Usuario',
        html: `No puedes eliminarte a ti mismo.`,
        icon: 'error'
      });
      return;
    }
    Swal.fire({
      title: 'Usuario',
      html: `¿Estas seguro que deseas eliminar a ${usuario.nombre}?, esta acción no puede deshacerse.`,
      icon: 'warning',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result: any) => {
      if (result.value) {
        this.ususarios$.eliminarUsuario(usuario).subscribe((resp: any) => {
          if (resp === true) {
            this.obtenerUsuarios();
          }
        });
      }
    });
  }

  refrescarSelect(ms: number) {
    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, ms);
  }
}
