import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Uds } from 'src/app/models/uds.model';
import { ContratosService } from 'src/app/services/contratos.service';
import { Contrato } from 'src/app/models/contrato.model';
import { UdsService } from 'src/app/services/uds.service';
import Swal from 'sweetalert2/src/sweetalert2.js';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
declare var jQuery: any;
declare function moment(): any;

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  formUsuario: FormGroup;
  cargando = false;
  contratosDisponibles: Contrato[] = [];
  // udsAsignadas: Uds[] = [];
  // udsDisponibles: Uds[] = [];
  verPassword = 'password';
  correoExiste = false;

  @ViewChild('password', { static: true }) iPasword: ElementRef;

  constructor(
    private fb: FormBuilder,
    private contratos$: ContratosService,
    private uds$: UdsService,
    private usuarios$: UsuarioService
  ) {}

  ngOnInit() {
    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required],
      documento: ['', Validators.required],
      correo: ['', Validators.required],
      telefono: '',
      rol: null,
      contratos: null,
      uds: [],
      password: ['', Validators.required],
      creadoEl: ''
    });

    this.obtenerContratos();
    this.refrescarSelect(600);
  }

  obtenerContratos() {
    this.contratos$.obtenerContratos().subscribe((resp: any) => {
      if (resp.ok === true) {
        // console.log(resp.contratos);
        this.contratosDisponibles = resp.contratos;
      }
    });
  }

  // obtenerUds(rol: string) {
  //   this.uds$.obtenerUds().subscribe((resp: any) => {
  //     const arreglo = [];
  //     if (resp.ok === true) {
  //       resp.uds.forEach((unidad: Uds) => {
  //         switch (rol) {
  //           case 'ADMIN':
  //             if (unidad.gestor === null) {
  //               arreglo.push(unidad);
  //             }
  //             break;

  //           case 'COORDINADOR':
  //             if (unidad.coordinador === null) {
  //               arreglo.push(unidad);
  //             }
  //             break;

  //           default:
  //             if (unidad.docentes.length < 2) {
  //               arreglo.push(unidad);
  //             }
  //             break;
  //         }
  //       });
  //       this.udsDisponibles = arreglo;
  //       // console.log('Uds asig: ', this.udsAsignadas);
  //       this.udsAsignadas.forEach((udsAsignada: Uds) => {
  //         const i = this.udsDisponibles.findIndex(
  //           (unidad: Uds) => unidad._id === udsAsignada._id
  //         );
  //         console.log(this.udsDisponibles[i]);
  //         this.udsDisponibles.splice(i, 1);
  //       });
  //       // console.log(this.udsDisponibles);
  //       this.refrescarSelect(500);
  //     }
  //   });
  // }

  // asignarUds(udsId: string) {
  //   const uds = this.udsDisponibles.find(unidad => unidad._id === udsId);
  //   const i = this.udsDisponibles.findIndex(unidad => unidad._id === udsId);
  //   this.udsAsignadas.push(uds);
  //   this.udsDisponibles.splice(i, 1);
  //   this.refrescarSelect(200);
  // }

  // removerUds(id: string) {
  //   const uds = this.udsAsignadas.find((unidad: Uds) => unidad._id === id);
  //   const i = this.udsAsignadas.findIndex((unidad: Uds) => unidad._id === id);
  //   this.udsAsignadas.splice(i, 1);
  //   this.udsDisponibles.push(uds);
  //   this.refrescarSelect(200);
  // }

  cambiarInputPassword() {
    if (this.verPassword === 'password') {
      this.verPassword = 'text';
    } else {
      this.verPassword = 'password';
    }
  }

  crearUsuario() {
    // const arreglo = [];
    // this.udsAsignadas.forEach((unidad: Uds) => {
    //   arreglo.push(unidad._id);
    // });
    // this.formUsuario.value.uds = arreglo;
    this.formUsuario.value.creadoEl = moment().format('YYYY-MM-DD');
    Swal.fire({
      title: 'Usuario',
      html: `¿Estas seguro de crear al usuario ${this.formUsuario.value.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      // confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear'
    }).then((result: any) => {
      if (result.value) {
        this.usuarios$
          .crearUsuario(this.formUsuario.value)
          .subscribe((resp: any) => {
            console.log('respuesta backend: ', resp);
            this.formUsuario.reset();
          });
      }
    });
    console.log(this.formUsuario.value);
  }

  refrescarSelect(ms: number) {
    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, ms);
  }
}
