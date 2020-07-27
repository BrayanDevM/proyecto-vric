import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// content-loader
import { NgxContentLoadingModule } from 'ngx-content-loading';

// Módulos externos
import { ComponentsModule } from '../components/components.module';

// Rutas
import { PagesRoutingModule } from './pages-routing.module';

// Páginas
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministrarComponent } from './administrar/administrar.component';
import { ContratosComponent } from './contratos/contratos.component';
import { UdsComponent } from './uds/uds.component';
import { BeneficiariosComponent } from './beneficiarios/beneficiarios.component';
import { BeneficiarioComponent } from './beneficiarios/beneficiario/beneficiario.component';
import { NovedadesComponent } from './beneficiarios/novedades/novedades.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ContratoComponent } from './contratos/contrato/contrato.component';
import { UnidadComponent } from './uds/unidad/unidad.component';
import { CrearUdsComponent } from './uds/crear-uds/crear-uds.component';
import { CrearContratoComponent } from './contratos/crear-contrato/crear-contrato.component';
import { MisBeneficiariosComponent } from './beneficiarios/mis-beneficiarios/mis-beneficiarios.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CrearUsuarioComponent } from './usuarios/crear-usuario/crear-usuario.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { UsuarioComponent } from './usuarios/usuario/usuario.component';
import { DashboardUdsComponent } from './dashboard/dashboard-uds/dashboard-uds.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ContratosComponent,
    UdsComponent,
    BeneficiariosComponent,
    BeneficiarioComponent,
    NovedadesComponent,
    AdministrarComponent,
    PerfilComponent,
    ContratoComponent,
    UnidadComponent,
    CrearUdsComponent,
    CrearContratoComponent,
    MisBeneficiariosComponent,
    UsuariosComponent,
    CrearUsuarioComponent,
    BusquedaComponent,
    UsuarioComponent,
    DashboardUdsComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxContentLoadingModule
  ],
  exports: []
})
export class PagesModule {}
