import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Páginas
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContratosComponent } from './contratos/contratos.component';
import { ContratoComponent } from './contratos/contrato/contrato.component';
import { UdsComponent } from './uds/uds.component';
import { NovedadesComponent } from './novedades/novedades.component';
import { BeneficiariosComponent } from './beneficiarios/beneficiarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UnidadComponent } from './uds/unidad/unidad.component';
import { CrearUdsComponent } from './uds/crear-uds/crear-uds.component';
import { CrearContratoComponent } from './contratos/crear-contrato/crear-contrato.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CrearUsuarioComponent } from './usuarios/crear-usuario/crear-usuario.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdministrarComponent } from './administrar/administrar.component';
import { DashboardUdsComponent } from './dashboard/dashboard-uds/dashboard-uds.component';
import { BeneficiariosUdsComponent } from './beneficiarios/tabla-beneficiarios/beneficiarios-uds.component';
import { BeneficiariosEstadoComponent } from './beneficiarios/tabla-beneficiarios/beneficiarios-estado.component';
import { BeneficiarioEditarComponent } from './beneficiarios/beneficiario-editar/beneficiario-editar.component';
import { UsuarioComponent } from './usuarios/usuario/usuario.component';

// Guards
import { VerificaTokenGuard } from '../services/guards/verifica-token.guard';
import { AdminGuard } from '../services/guards/admin.guard';
import { SupervisorGuard } from '../services/guards/supervisor.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [VerificaTokenGuard],
    component: DashboardComponent,
    data: { nombrePagina: 'Dashboard' }
  },
  {
    path: 'dashboard/uds/:unidadId',
    canActivate: [VerificaTokenGuard],
    component: DashboardUdsComponent,
    data: { nombrePagina: 'Dashboard UDS' }
  },
  {
    path: 'contratos',
    component: ContratosComponent,
    canActivate: [SupervisorGuard, VerificaTokenGuard],
    children: [
      {
        path: 'contrato/:contratoId',
        component: ContratoComponent,
        data: { nombrePagina: 'Ver contrato' }
      },
      {
        path: 'crear',
        component: CrearContratoComponent,
        data: { nombrePagina: 'Crear contrato' }
      }
    ],
    data: { nombrePagina: 'Contratos' }
  },
  {
    path: 'unidades-de-servicio',
    component: UdsComponent,
    canActivate: [SupervisorGuard, VerificaTokenGuard],
    children: [
      {
        path: 'unidad/:udsId',
        component: UnidadComponent,
        data: { nombrePagina: 'Ver UDS' }
      },
      {
        path: 'crear',
        component: CrearUdsComponent,
        data: { nombrePagina: 'Crear UDS' }
      }
    ],
    data: { nombrePagina: 'Unidades De Servicio' }
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    children: [
      {
        path: 'usuario/:usuarioId',
        component: UsuarioComponent,
        data: { nombrePagina: 'Ver usuario' }
      },
      {
        path: 'crear',
        component: CrearUsuarioComponent,
        data: { nombrePagina: 'Crear usuario' }
      }
    ],
    data: { nombrePagina: 'Usuarios' }
  },
  {
    path: 'beneficiarios',
    canActivate: [VerificaTokenGuard],
    component: BeneficiariosComponent,
    children: [
      {
        path: 'uds/:udsId',
        component: BeneficiariosUdsComponent,
        data: { nombrePagina: 'Beneficiarios' }
      },
      {
        path: 'estado/:estado',
        component: BeneficiariosEstadoComponent,
        data: { nombrePagina: 'Beneficiarios' }
      }
    ],
    data: { nombrePagina: 'Beneficiarios' }
  },
  {
    path: 'beneficiario/editar/:id',
    canActivate: [VerificaTokenGuard],
    component: BeneficiarioEditarComponent,
    data: { nombrePagina: 'Edición de beneficiario' }
  },
  {
    path: 'novedades',
    canActivate: [VerificaTokenGuard],
    component: NovedadesComponent,
    data: { nombrePagina: 'Novedades' }
  },
  {
    path: 'administrar',
    component: AdministrarComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    data: { nombrePagina: 'Administrar' }
  },
  {
    path: 'perfil',
    canActivate: [VerificaTokenGuard],
    component: PerfilComponent,
    data: { nombrePagina: 'Usuarios' }
  },
  {
    path: 'buscar/:criterio',
    canActivate: [VerificaTokenGuard],
    component: BusquedaComponent,
    data: { nombrePagina: 'Usuarios' }
  },
  { path: '**', pathMatch: 'full', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
