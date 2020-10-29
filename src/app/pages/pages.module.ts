import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// content-loader
import { NgxContentLoadingModule } from "ngx-content-loading";

// Módulos externos
import { ComponentsModule } from "../components/components.module";
import { AppPipesModule } from "../pipes/app-pipes.module";
import { MaterialModule } from "../material/material.module";

// Rutas
import { PagesRoutingModule } from "./pages-routing.module";

// Páginas
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AdministrarComponent } from "./administrar/administrar.component";
import { ContratosComponent } from "./contratos/contratos.component";
import { UdsComponent } from "./uds/uds.component";
import { BeneficiariosComponent } from "./beneficiarios/beneficiarios.component";
import { BeneficiarioComponent } from "./beneficiarios/beneficiario/beneficiario.component";
import { NovedadesComponent } from "./novedades/novedades.component";
import { AjustesComponent } from "./ajustes/ajustes.component";
import { ContratoComponent } from "./contratos/contrato/contrato.component";
import { UnidadComponent } from "./uds/unidad/unidad.component";
import { CrearUdsComponent } from "./uds/crear-uds/crear-uds.component";
import { CrearContratoComponent } from "./contratos/crear-contrato/crear-contrato.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { CrearUsuarioComponent } from "./usuarios/crear-usuario/crear-usuario.component";
import { BusquedaComponent } from "./busqueda/busqueda.component";
import { UsuarioComponent } from "./usuarios/usuario/usuario.component";
import { DashboardUdsComponent } from "./dashboard/dashboard-uds/dashboard-uds.component";
import { BeneficiariosUdsComponent } from "./beneficiarios/tabla-beneficiarios/beneficiarios-uds.component";
import { BeneficiariosEstadoComponent } from "./beneficiarios/tabla-beneficiarios/beneficiarios-estado.component";
import { BeneficiarioEditarComponent } from "./beneficiarios/beneficiario-editar/beneficiario-editar.component";
import { AyudaComponent } from "./ayuda/ayuda.component";
import { FaqsComponent } from "./ayuda/faqs/faqs.component";
import { GuiasComponent } from "./ayuda/guias/guias.component";
import { SoporteComponent } from "./ayuda/soporte/soporte.component";
import { QueEsEstaAppComponent } from "./ayuda/guias/iniciando/que-es-esta-app.component";
import { ReportarNacimientoComponent } from "./ayuda/guias/beneficiarios/reportar-nacimiento.component";

@NgModule({
  declarations: [
    DashboardComponent,
    ContratosComponent,
    UdsComponent,
    BeneficiariosComponent,
    BeneficiarioComponent,
    NovedadesComponent,
    AdministrarComponent,
    AjustesComponent,
    ContratoComponent,
    UnidadComponent,
    CrearUdsComponent,
    CrearContratoComponent,
    UsuariosComponent,
    CrearUsuarioComponent,
    BusquedaComponent,
    UsuarioComponent,
    DashboardUdsComponent,
    BeneficiariosUdsComponent,
    BeneficiariosEstadoComponent,
    BeneficiarioEditarComponent,
    AyudaComponent,
    FaqsComponent,
    GuiasComponent,
    SoporteComponent,
    QueEsEstaAppComponent,
    ReportarNacimientoComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
    MaterialModule,
    AppPipesModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxContentLoadingModule,
  ],
  exports: [],
})
export class PagesModule {}
