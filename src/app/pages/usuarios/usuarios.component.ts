import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { Contrato } from 'src/app/models/contrato.model';
import { ContratosService } from 'src/app/services/contratos.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Config } from 'src/app/config/config';
import { PageLoadingService } from 'src/app/services/page-loading.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  // Config
  sidenavMode = 'side';
  sidenavBackdrop = false;
  sidenavOpen = false;

  // data ng-select
  roles: any[] = Config.SELECTS.usuariosRoles;
  // ---------------------
  usuarios: Usuario[] = [];
  contratosDisponibles: Contrato[] = [];
  usuarioInfo: Usuario = null;
  tablaColumnas: string[] = ['nombre', 'correo', 'telefono', 'rol', 'activo'];
  tablaData: MatTableDataSource<any>;
  usuariosFiltrados = false;

  // variables para almacenar subscripción y poder desuscribirnos
  usuarioNuevo: Subscription;
  usuarioEliminado: Subscription;
  usuarioActualizado: Subscription;

  constructor(
    private pageLoading$: PageLoadingService,
    private ususarios$: UsuarioService,
    private contratos$: ContratosService,
    private router: Router
  ) {
    this.detectarPantalla();
  }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerContratos();
    this.subsUsuarioNuevo();
    this.subsUsuarioEliminado();
    this.subsUsuarioActualizado();
    this.pageLoading$.loadingPages.emit(false);
  }

  get cantRegistros(): number {
    return this.tablaData.filteredData.length;
  }

  obtenerUsuarios() {
    this.ususarios$.obtenerUsuarios().subscribe((usuarios: Usuario[]) => {
      this.usuarios = usuarios;
      this.tablaData = new MatTableDataSource(this.usuarios);
    });
  }
  obtenerUsuariosFiltro(query: string) {
    this.ususarios$.obtenerUsuarios(query).subscribe((resp: any) => {
      this.usuarios = resp.usuarios;
      this.tablaData = new MatTableDataSource(this.usuarios);
      this.usuariosFiltrados = true;
    });
  }

  crear() {
    this.router.navigate(['usuarios/crear']);
  }

  verUsuario(id?: string) {
    this.router.navigate(['usuarios/usuario', id]);
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

  editarUsuario(usuario: Usuario) {
    this.router.navigate(['/usuarios', usuario._id]);
  }

  removerFiltro() {
    this.usuariosFiltrados = false;
    this.obtenerUsuarios();
  }

  filtrarTabla(event: Event) {
    const criterioBusqueda = (event.target as HTMLInputElement).value;
    this.tablaData.filter = criterioBusqueda.trim().toLowerCase();
  }

  // subscribes
  /**
   * Nos suscribimos al emisor de cambios en caso de que se emita un nuevo contrato.
   * Agregamos al final el nuevo contrato, actualizamos tabla y sumamos 1 al contador
   */
  subsUsuarioNuevo(): void {
    this.usuarioNuevo = this.ususarios$.usuarioNuevo$.subscribe(
      (usuario: Usuario) => {
        this.usuarios.push(usuario);
        this.tablaData = new MatTableDataSource(this.usuarios);
      }
    );
  }

  /**
   * Nos suscribimos al emisor de cambios en caso de que se emita un nuevo contrato.
   * Eliminamos el contrato del arreglo, actualizamos tabla y restamos 1 al contador
   */
  subsUsuarioEliminado(): void {
    this.usuarioEliminado = this.ususarios$.usuarioEliminado$.subscribe(
      (id: string) => {
        const i = this.usuarios.findIndex(usuario => usuario._id === id);
        this.usuarios.splice(i, 1);
        this.tablaData = new MatTableDataSource(this.usuarios);
      }
    );
  }

  /**
   * Nos suscribimos al emisor de cambios en caso de que se emita un nuevo contrato.
   * Agregamos al final el nuevo contrato, actualizamos tabla y sumamos 1 al contador
   */
  subsUsuarioActualizado(): void {
    this.usuarioActualizado = this.ususarios$.usuarioActualizado$.subscribe(
      (usuarioAct: Usuario) => {
        const i = this.usuarios.findIndex(
          usuario => usuario._id === usuarioAct._id
        );
        this.usuarios.splice(i, 1, usuarioAct);
        this.tablaData = new MatTableDataSource(this.usuarios);
      }
    );
  }

  // Nos desuscribimos para mejorar performance
  desuscribir(): void {
    this.usuarioNuevo.unsubscribe();
    this.usuarioEliminado.unsubscribe();
    this.usuarioActualizado.unsubscribe();
  }

  // Detecta tamaño de pantalla y modifica sidebar
  detectarPantalla(): void {
    if (screen.width <= 1024) {
      this.sidenavMode = 'push';
      this.sidenavBackdrop = false;
      this.sidenavOpen = false;
    }
  }
}
