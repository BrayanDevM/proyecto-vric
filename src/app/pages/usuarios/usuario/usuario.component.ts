import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import { Usuario } from 'src/app/models/usuario.model';
import { NgOption } from '@ng-select/ng-select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuario: Usuario;
  contratosDisponibles: Contrato[] = [];
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
  cargando = false;

  constructor(
    private rutaActual: ActivatedRoute,
    private contrato$: ContratosService,
    private usuarios$: UsuarioService,
    private router: Router
  ) {
    this.obtenerUsuario();
  }

  ngOnInit(): void {
    this.obtenerContratos();
  }

  obtenerUsuario() {
    this.rutaActual.params.subscribe((resp: Params) => {
      this.usuarios$.obtenerUsuario(resp.id).subscribe((usuario: any) => {
        this.usuario = usuario.usuario;
        this.usuario.password = null;
      });
    });
  }

  obtenerContratos() {
    this.contrato$.obtenerContratos().subscribe((resp: any) => {
      this.contratosDisponibles = resp.contratos;
    });
  }

  actualizarUsuario() {
    this.cargando = true;
    this.usuarios$.actualizarUsuario(this.usuario).subscribe((resp: any) => {
      if (resp.ok) {
        this.cargando = false;
        Swal.fire(
          'Usuario actualizado',
          `Usuario ${this.usuario.nombre} actualizado correctamente`,
          'success'
        );
        this.router.navigate(['/usuarios']);
      } else {
        this.cargando = false;
      }
    });
  }
}
