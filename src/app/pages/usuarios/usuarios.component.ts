import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { Router } from '@angular/router';
import { Contrato } from 'src/app/models/contrato.model';
import { ContratosService } from 'src/app/services/contratos.service';
import { NgOption } from '@ng-select/ng-select';
import { alertError } from 'src/app/helpers/swal2.config';
declare var jQuery: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  // data ng-select
  roles: NgOption = [
    {
      value: 'ADMIN',
      label: 'Administrador',
      icon: 'fas fa-user-shield text-danger'
    },
    { value: 'GESTOR', label: 'Gestor', icon: 'fas fa-user text-success' },
    {
      value: 'COORDINADOR',
      label: 'Coordinador',
      icon: 'fas fa-user text-primary'
    },
    { value: 'DOCENTE', label: 'Docente', icon: 'fas fa-user text-secondary' }
  ];
  // ---------------------
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
    this.obtenerContratos();
  }

  obtenerUsuarios() {
    this.cargando = true;
    this.ususarios$.obtenerUsuarios().subscribe((resp: any) => {
      if (resp.ok) {
        this.usuarios = resp.usuarios;
        this.cargando = false;
        // console.log(resp.usuarios);
      } else {
        this.cargando = false;
        console.log('Error al traer usuarios', resp);
      }
    });
  }

  obtenerContratos() {
    this.contratos$.obtenerContratos().subscribe((resp: any) => {
      if (resp.ok === true) {
        this.contratosDisponibles = resp.contratos;
      }
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
    this.router.navigate(['/usuarios', usuario._id]);
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario._id === this.ususarios$.usuario._id) {
      alertError.fire({
        title: 'No puedes eliminarte a ti mismo'
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
}
