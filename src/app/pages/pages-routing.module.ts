import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Páginas
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContratosComponent } from './contratos/contratos.component';
import { ContratoComponent } from './contratos/contrato/contrato.component';
import { UdsComponent } from './uds/uds.component';
import { NovedadesComponent } from './beneficiarios/novedades/novedades.component';
import { BeneficiariosComponent } from './beneficiarios/beneficiarios.component';
import { BeneficiarioComponent } from './beneficiarios/beneficiario/beneficiario.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UnidadComponent } from './uds/unidad/unidad.component';
import { CrearUdsComponent } from './uds/crear-uds/crear-uds.component';
import { CrearContratoComponent } from './contratos/crear-contrato/crear-contrato.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CrearUsuarioComponent } from './usuarios/crear-usuario/crear-usuario.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdministrarComponent } from './administrar/administrar.component';

// Guards
import { AdminGuard } from '../services/guards/admin.guard';
import { VerificaTokenGuard } from '../services/guards/verifica-token.guard';
import { UsuarioComponent } from './usuarios/usuario/usuario.component';
import { DashboardUdsComponent } from './dashboard/dashboard-uds/dashboard-uds.component';
import { BeneficiariosUdsComponent } from './beneficiarios/tabla-beneficiarios/beneficiarios-uds.component';
import { BeneficiariosEstadoComponent } from './beneficiarios/tabla-beneficiarios/beneficiarios-estado.component';
import { BeneficiarioFormComponent } from './beneficiarios/beneficiario-form/beneficiario-form.component';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [VerificaTokenGuard],
    component: DashboardComponent,
    data: { nombrePagina: 'Dashboard' }
  },
  {
    path: 'dashboard/uds/:id',
    canActivate: [VerificaTokenGuard],
    component: DashboardUdsComponent,
    data: { nombrePagina: 'Dashboard UDS' }
  },
  {
    path: 'contratos',
    component: ContratosComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    children: [
      { path: 'contrato/:id', component: ContratoComponent },
      { path: 'crear', component: CrearContratoComponent }
    ],
    data: { nombrePagina: 'Contratos' }
  },
  {
    path: 'unidades-de-servicio',
    component: UdsComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    children: [
      { path: 'unidad/:id', component: UnidadComponent },
      { path: 'crear', component: CrearUdsComponent }
    ],
    data: { nombrePagina: 'Unidades De Servicio' }
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AdminGuard, VerificaTokenGuard],
    children: [
      { path: 'usuario/:id', component: UsuarioComponent },
      { path: 'crear', component: CrearUsuarioComponent }
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
    component: BeneficiarioFormComponent,
    data: { nombrePagina: 'Edición de beneficiario' }
  },
  {
    path: 'beneficiarios/novedades',
    canActivate: [VerificaTokenGuard],
    component: NovedadesComponent,
    data: { nombrePagina: 'Reporte de novedades' }
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
