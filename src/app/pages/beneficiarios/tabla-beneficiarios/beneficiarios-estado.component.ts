import { Component, OnInit, OnDestroy } from '@angular/core';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute, ActivationEnd } from '@angular/router';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { MatDialog } from '@angular/material/dialog';
import { filter, map } from 'rxjs/operators';
import { BeneficiarioComponent } from '../beneficiario/beneficiario.component';
import { Uds } from 'src/app/models/uds.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UdsService } from 'src/app/services/uds.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-beneficiarios-estado',
  templateUrl: './beneficiarios-estado.component.html',
  styles: []
})
export class BeneficiariosEstadoComponent implements OnInit, OnDestroy {
  // variables de configuración
  tablaColumnas: string[] = [
    'tipoDoc',
    'documento',
    'nombre1',
    'nombre2',
    'apellido1',
    'apellido2',
    'nacimiento',
    'estado',
    'uds'
  ];
  abrirSidenav = false;

  // variables de uso
  beneficiarios: Beneficiario[] = [];
  udsAsignadas: Uds[] = [];
  tablaData: MatTableDataSource<any>;
  criterioBusqueda = '';

  // querys
  queryUsuario: string;
  queryUdsAsignadas = '';

  // Observables
  beneficiarioEliminado: Subscription;
  nuevaBusqueda: Subscription;

  constructor(
    private router: Router,
    protected ar: ActivatedRoute,
    private usuario$: UsuarioService,
    private uds$: UdsService,
    private beneficiarios$: BeneficiariosService,
    private dialog: MatDialog,
    private notif: MatSnackBar
  ) {
    this.obtenerInfoRuta().subscribe(estado => {
      if (estado !== undefined) {
        this.obtenerUdsAsignadas().then(exito => {
          if (exito) {
            this.obtenerBeneficiarios_responsables(
              estado,
              this.queryUdsAsignadas
            );
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.subsBeneficiarioEliminado();
  }

  ngOnDestroy(): void {
    this.desuscribir();
  }

  obtenerInfoRuta(): Observable<any> {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.params.estado)
    );
  }

  obtenerUdsAsignadas(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      switch (this.usuario$.usuario.rol) {
        case 'ADMIN':
          this.queryUsuario = `admin=${this.usuario$.usuario._id}`;
          break;
        case 'GESTOR':
          this.queryUsuario = `gestor=${this.usuario$.usuario._id}`;
          break;
        case 'COORDINADOR':
          this.queryUsuario = `coordinador=${this.usuario$.usuario._id}`;
          break;
        default:
          this.queryUsuario = `docente=${this.usuario$.usuario._id}`;
          break;
      }
      // Si ya ha consultado una vez sólo toma los datos del LS
      const udsEnLocal = localStorage.getItem('udsAsignadas');
      if (udsEnLocal !== null) {
        this.udsAsignadas = JSON.parse(udsEnLocal);
        // obtengo Ids para query (estado)
        this.udsAsignadas.forEach((unidad: Uds) => {
          this.queryUdsAsignadas += `&uds=${unidad._id}`;
        });
        resolve(true);
      } else {
        this.uds$
          .obtenerUds_codigos(this.queryUsuario)
          .subscribe((resp: any) => {
            if (resp.ok) {
              this.udsAsignadas = resp.uds;
              // obtengo Ids para query (estado)
              this.udsAsignadas.forEach((unidad: Uds) => {
                this.queryUdsAsignadas += `&uds=${unidad._id}`;
              });

              localStorage.setItem(
                'udsAsignadas',
                JSON.stringify(this.udsAsignadas)
              );

              resolve(true);
            } else {
              reject(false);
            }
          });
      }
    });
  }

  obtenerBeneficiarios_responsables(estado: string, uds: string) {
    const query = `&estado=${estado}` + uds;
    this.beneficiarios$
      .obtenerBeneficiarios_responsables(query)
      .subscribe((resp: any) => {
        if (resp.ok) {
          this.beneficiarios = resp.beneficiarios;
          this.tablaData = new MatTableDataSource(this.beneficiarios);
          this.beneficiarios$.subtituloPag$.emit(
            `${this.beneficiarios.length} Beneficiarios`
          );
        }
      });
  }

  openDialog(beneficiario: Beneficiario) {
    this.dialog.open(BeneficiarioComponent, {
      minWidth: '640px',
      data: beneficiario
    });
  }

  filtrarTabla(event: Event) {
    const criterioBusqueda = (event.target as HTMLInputElement).value;
    this.tablaData.filter = criterioBusqueda.trim().toLowerCase();
    this.beneficiarios$.subtituloPag$.emit(
      `${this.tablaData.filteredData.length} Beneficiarios`
    );
  }

  subsBeneficiarioEliminado(): void {
    this.beneficiarioEliminado = this.beneficiarios$.beneficiarioEliminado.subscribe(
      (beneficiario: Beneficiario) => {
        const i = this.beneficiarios.findIndex(b => b._id === beneficiario._id);
        this.beneficiarios.splice(i, 1);
        this.tablaData = new MatTableDataSource(this.beneficiarios);
        this.dialog.closeAll();
        this.notif.open('Beneficiario eliminado', null, {
          duration: 3000
        });
      }
    );
  }

  desuscribir(): void {
    this.beneficiarioEliminado.unsubscribe();
  }
}
