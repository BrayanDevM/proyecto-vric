import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import { Usuario } from 'src/app/models/usuario.model';
import { NgOption } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { alertError, alertSuccess } from 'src/app/helpers/swal2.config';

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
  actualizando = false;

  constructor(
    private rutaActual: ActivatedRoute,
    private contrato$: ContratosService,
    private usuarios$: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerUsuario();
    this.obtenerContratos();
  }

  obtenerUsuario() {
    this.rutaActual.params.subscribe((params: Params) => {
      this.usuarios$.obtenerUsuario(params.id).subscribe((resp: any) => {
        if (resp.ok) {
          this.usuario = resp.usuario;
          this.usuario.password = null;
        } else {
          alertError.fire({
            title: 'Usuario',
            text:
              'No se ha podido obtener la información, intentalo nuevamente.'
          });
        }
      });
    });
  }

  obtenerContratos() {
    this.contrato$.obtenerContratos().subscribe((resp: any) => {
      if (resp.ok) {
        this.contratosDisponibles = resp.contratos;
      } else {
        alertError.fire({
          title: 'Usuario',
          text: 'No se han podido obtener los contratos para asignar a usuario.'
        });
      }
    });
  }

  actualizarUsuario() {
    this.actualizando = true;
    this.usuarios$.actualizarUsuario(this.usuario).subscribe((resp: any) => {
      if (resp.ok) {
        this.actualizando = false;
        alertSuccess.fire({
          title: 'Usuario',
          html: `Usuario ${this.usuario.nombre} actualizado correctamente`
        });
        this.router.navigate(['/usuarios']);
      } else {
        this.actualizando = false;
        alertError.fire({
          title: 'Usuario',
          text: 'No se ha podido actualizar al usuario, intentalo nuevamente'
        });
      }
    });
  }
}
