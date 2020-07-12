import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';

// Componentes
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { TablaBeneficiariosComponent } from './tabla-beneficiarios/tabla-beneficiarios.component';
import { FormIngresosComponent } from './form-ingresos/form-ingresos.component';
import { DocumentoPipe } from '../pipes/documento.pipe';
import { FormEgresosComponent } from './form-egresos/form-egresos.component';
import { FormCambiosComponent } from './form-cambios/form-cambios.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { InfoBeneficiarioComponent } from './modals/info-beneficiario/info-beneficiario.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent,
    TablaBeneficiariosComponent,
    FormIngresosComponent,
    DocumentoPipe,
    FormEgresosComponent,
    FormCambiosComponent,
    PieChartComponent,
    InfoBeneficiarioComponent,
    LineChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    BreadcrumbComponent,
    TablaBeneficiariosComponent,
    FormIngresosComponent,
    FormEgresosComponent,
    FormCambiosComponent,
    InfoBeneficiarioComponent,
    PieChartComponent,
    LineChartComponent
  ]
})
export class ComponentsModule {}
