import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { Uds } from 'src/app/models/uds.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UdsService } from 'src/app/services/uds.service';
declare var jQuery: any;
declare function moment(): any;

@Component({
  selector: 'app-crear-uds',
  templateUrl: './crear-uds.component.html',
  styleUrls: ['./crear-uds.component.css']
})
export class CrearUdsComponent implements OnInit, AfterViewInit {
  uds: Uds;
  coordinadores: Usuario[];
  gestores: Usuario[];
  docentes: Usuario[];
  docentesEnUds: [string, string];
  cargando = false;
  formCrearUds: FormGroup;

  constructor(
    private usuarios$: UsuarioService,
    private uds$: UdsService,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit() {
    jQuery('.selectpicker').selectpicker();
  }

  ngOnInit() {
    // Obtener datos
    this.obtenerDocentes();
    this.obtenerCoordinadores();
    this.obtenerGestores();

    // Intancio nuevo formulario
    this.formCrearUds = this.fb.group({
      codigo: [null, Validators.required],
      nombre: [null, [Validators.required, Validators.minLength(5)]],
      cupos: null,
      ubicacion: null,
      coordinador: null,
      gestor: null,
      docentes: null,
      creadoEl: null,
      arriendo: null
    });

    setTimeout(() => {
      jQuery('.selectpicker').selectpicker('refresh');
    }, 300);
  }

  obtenerDocentes() {
    this.usuarios$.obtenerUsuarios().subscribe((resp: any) => {
      const arreglo = [];
      resp.usuarios.forEach((usuario: Usuario) => {
        if (usuario.rol === 'DOCENTE') {
          arreglo.push(usuario);
        }
      });
      this.docentes = arreglo;
    });
  }

  obtenerCoordinadores() {
    this.usuarios$.obtenerUsuarios().subscribe((resp: any) => {
      const arreglo = [];
      resp.usuarios.forEach((usuario: Usuario) => {
        if (usuario.rol === 'COORDINADOR') {
          arreglo.push(usuario);
        }
      });
      this.coordinadores = arreglo;
    });
  }

  obtenerGestores() {
    this.usuarios$.obtenerUsuarios().subscribe((resp: any) => {
      const arreglo = [];
      resp.usuarios.forEach((usuario: Usuario) => {
        if (usuario.rol === 'ADMIN') {
          arreglo.push(usuario);
        }
      });
      this.gestores = arreglo;
    });
  }

  // Conveniente para acceder rápidamente a las validaciones
  get f() {
    return this.formCrearUds.controls;
  }

  crear() {
    if (this.formCrearUds.invalid) {
      return;
    }
    this.cargando = true;
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
    console.log(this.uds);
    this.uds$.crearUds(this.uds).subscribe();
    this.cargando = false;
    this.formCrearUds.reset();
  }
}
