import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Uds } from 'src/app/models/uds.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective
} from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UdsService } from 'src/app/services/uds.service';
import { alertSuccess } from 'src/app/helpers/swal2.config';
import { Router } from '@angular/router';
declare function moment(): any;

@Component({
  selector: 'app-crear-uds',
  templateUrl: './crear-uds.component.html',
  styleUrls: ['./crear-uds.component.css']
})
export class CrearUdsComponent implements OnInit {
  uds: Uds;
  coordinadores: Usuario[] = [];
  gestores: Usuario[] = [];
  docentes: Usuario[] = [];
  docentesSeleccionadas: any[] = [];
  docentesEnUds: [string, string];
  formCrearUds: FormGroup;

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(
    private usuarios$: UsuarioService,
    private uds$: UdsService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Intancio nuevo formulario
    this.formCrearUds = this.fb.group({
      nombre: [null, [Validators.required, Validators.minLength(5)]],
      codigo: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      cupos: [null, Validators.required],
      ubicacion: [null, Validators.required],
      coordinador: [null, Validators.required],
      gestor: [null, Validators.required],
      docentes: [null, Validators.required],
      creadoEl: null,
      arriendo: null
    });
  }

  get f() {
    return this.formCrearUds;
  }
  get fv() {
    return this.formCrearUds.value;
  }
  get fc() {
    return this.formCrearUds.controls;
  }

  ngOnInit() {
    // Obtener datos
    this.obtenerDocentes();
    this.obtenerCoordinadores();
    this.obtenerGestores();
  }

  maxTwoSelected() {
    if (this.fv.docentes.length < 3) {
      this.docentesSeleccionadas = this.fv.docentes;
    } else {
      this.f.get('docentes').patchValue(this.docentesSeleccionadas);
    }
  }

  cancelar() {
    this.router.navigate(['/unidades-de-servicio']);
  }

  obtenerDocentes() {
    this.usuarios$.obtenerUsuarios().subscribe((docentes: Usuario[]) => {
      const arreglo = [];
      docentes.forEach((usuario: Usuario) => {
        if (usuario.rol === 'DOCENTE') {
          arreglo.push(usuario);
        }
      });
      this.docentes = arreglo;
    });
  }

  obtenerCoordinadores() {
    this.usuarios$.obtenerUsuarios().subscribe((coords: Usuario[]) => {
      const arreglo = [];
      coords.forEach((usuario: Usuario) => {
        if (usuario.rol === 'COORDINADOR') {
          arreglo.push(usuario);
        }
      });
      this.coordinadores = arreglo;
    });
  }

  obtenerGestores() {
    this.usuarios$.obtenerUsuarios().subscribe((gestores: Usuario[]) => {
      const arreglo = [];
      gestores.forEach((usuario: Usuario) => {
        if (usuario.rol === 'ADMIN') {
          arreglo.push(usuario);
        }
      });
      this.gestores = arreglo;
    });
  }

  crear() {
    if (this.formCrearUds.invalid) {
      return;
    }
    this.uds = new Uds(
      this.formCrearUds.value.codigo,
      this.formCrearUds.value.cupos,
      this.formCrearUds.value.nombre,
      this.formCrearUds.value.ubicacion,
      this.formCrearUds.value.arriendo,
      this.usuarios$.usuario._id,
      [],
      moment().format('DD/MM/YYYY'),
      this.formCrearUds.value.docentes,
      this.formCrearUds.value.coordinador,
      this.formCrearUds.value.gestor,
      false
    );
    this.uds$.crearUds(this.uds).subscribe((resp: any) => {
      if (resp.ok) {
        this.uds$.udsNueva$.emit(resp.udsCreada);
        alertSuccess.fire('Unidad De Servicio creada');
        this.formGroupDirective.resetForm();
      }
    });
  }
}
