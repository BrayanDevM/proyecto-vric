import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, ActivationEnd } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import { Usuario } from 'src/app/models/usuario.model';
import {
  alertError,
  alertSuccess,
  alertDanger
} from 'src/app/helpers/swal2.config';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  roles: any[] = [
    {
      value: 'ADMIN',
      label: 'Administrador',
      icon: 'fa-user',
      iconColor: 'text-danger'
    },
    {
      value: 'GESTOR',
      label: 'Gestor',
      icon: 'fa-user',
      iconColor: 'text-primary'
    },
    {
      value: 'COORDINADOR',
      label: 'Coordinador',
      icon: 'fa-user',
      iconColor: 'text-info'
    },
    {
      value: 'DOCENTE',
      label: 'Docente',
      icon: 'fa-user',
      iconColor: 'text-secondary'
    }
  ];
  usuario: Usuario;
  contratosDisponibles: Contrato[] = [];
  contratosAsignados: Contrato[] = [];
  formActualizarUsuario: FormGroup;
  editMode = false;
  hide = true;

  constructor(
    private contrato$: ContratosService,
    private usuarios$: UsuarioService,
    private router: Router,
    private fb: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.formActualizarUsuario = this.fb.group({
      nombre: [null, Validators.required],
      documento: null,
      correo: [null, Validators.required],
      telefono: [null, Validators.required],
      rol: null,
      contratos: [],
      activo: false,
      password: null
    });
    this.registrarIconos();
    this.obtenerContratos();
    this.obtenerInfoRuta().subscribe(usuarioId => {
      if (usuarioId !== undefined) {
        this.obtenerUsuario(usuarioId);
        this.editMode = false;
      }
    });
  }

  ngOnInit(): void {}

  get fv() {
    return this.formActualizarUsuario.value;
  }

  volver() {
    this.router.navigate(['usuarios']);
  }

  obtenerInfoRuta(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.params.usuarioId)
    );
  }

  obtenerUsuario(id: string) {
    this.usuarios$.obtenerUsuario(id).subscribe((resp: any) => {
      if (!resp.ok) {
        this.volver();
        return;
      }
      this.usuario = resp.usuario;
      this.usuario.password = null;
      this.usuario.contratos.forEach(contrato => {
        this.contratosAsignados.push(contrato._id);
      });
      this.setUsuarioEnFormulario();
    });
  }

  obtenerContratos() {
    this.contrato$.obtenerContratos().subscribe((contratos: Contrato[]) => {
      this.contratosDisponibles = contratos;
    });
  }

  actualizar() {
    this.usuario.nombre = this.fv.nombre;
    this.usuario.documento = this.fv.documento + '';
    this.usuario.correo = this.fv.correo;
    this.usuario.telefono = this.fv.telefono;
    this.usuario.rol = this.fv.rol;
    this.usuario.contratos = this.fv.contratos;
    this.usuario.activo = this.fv.activo;
    this.usuario.password = this.fv.password;

    this.usuarios$.actualizarUsuario(this.usuario).subscribe((resp: any) => {
      if (resp.ok) {
        alertSuccess.fire('Usuario actualizado');
        this.usuarios$.usuarioActualizado$.emit(resp.usuarioActualizado);
        this.editMode = false;
      } else {
        alertError.fire({
          title: 'Usuario',
          text: 'No se ha podido actualizar al usuario, intentalo nuevamente'
        });
      }
    });
  }

  eliminar() {
    if (this.usuario._id === this.usuarios$.usuario._id) {
      alertError.fire({
        title: 'No puedes eliminarte a ti mismo'
      });
      return;
    }
    alertDanger
      .fire({
        title: 'Usuario',
        html: `¿Estas seguro que deseas eliminar a ${this.usuario.nombre}?, esta acción no puede deshacerse.`,
        confirmButtonText: 'Sí, eliminar!'
      })
      .then((result: any) => {
        if (result.value) {
          this.usuarios$
            .eliminarUsuario(this.usuario)
            .subscribe((resp: any) => {
              if (resp.ok) {
                alertSuccess.fire('Usuario eliminado');
                this.usuarios$.usuarioEliminado$.emit(this.usuario._id);
                this.volver();
              }
            });
        }
      });
  }

  setUsuarioEnFormulario() {
    this.formActualizarUsuario.get('nombre').patchValue(this.usuario.nombre);
    this.formActualizarUsuario
      .get('documento')
      .patchValue(this.usuario.documento);
    this.formActualizarUsuario.get('activo').patchValue(this.usuario.activo);
    this.formActualizarUsuario.get('correo').patchValue(this.usuario.correo);
    this.formActualizarUsuario
      .get('telefono')
      .patchValue(this.usuario.telefono);
    this.formActualizarUsuario.get('rol').patchValue(this.usuario.rol);
    this.formActualizarUsuario
      .get('contratos')
      .patchValue(this.contratosAsignados);
  }

  registrarIconos() {
    // iconos personalizados
    this.matIconRegistry.addSvgIcon(
      'whatsapp',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/iconos/whatsapp.svg'
      )
    );
  }

  whatsApp(tel: string) {
    window.open(`https://api.whatsapp.com/send?phone=+57${tel}`, '_blank');
  }
}
