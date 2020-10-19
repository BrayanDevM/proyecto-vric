import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

// Módulos
import { MaterialModule } from '../material/material.module';
import { AppPipesModule } from '../pipes/app-pipes.module';
import { OverlayModule } from '@angular/cdk/overlay';

// Componentes
import { SidebarComponent } from './sidebar/sidebar.component';
import { DialogAcercaDeComponent } from './dialogs/dialog-acerca-de/dialog-acerca-de.component';
import { FormIngresosComponent } from './form-ingresos/form-ingresos.component';
import { FormEgresosComponent } from './form-egresos/form-egresos.component';
import { FormCambiosComponent } from './form-cambios/form-cambios.component';
import { DialogFormIngresoComponent } from './dialogs/dialog-form-ingreso/dialog-form-ingreso.component';
import { ApexPieChartComponent } from './apexchart/apex-pie-chart/apex-pie-chart.component';
import { ApexLineChartTimeseriesComponent } from './apexchart/apex-line-chart-timeseries/apex-line-chart-timeseries.component';
import { ApexLineChartMinComponent } from './apexchart/apex-line-chart-min/apex-line-chart-min.component';
import { ApexBarChartStackedComponent } from './apexchart/apex-bar-chart-stacked/apex-bar-chart-stacked.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { SearchToolbarComponent } from './search-toolbar/search-toolbar.component';

const components = [
  SidebarComponent,
  DialogAcercaDeComponent,
  FormIngresosComponent,
  FormEgresosComponent,
  FormCambiosComponent,
  DialogFormIngresoComponent,
  ApexPieChartComponent,
  ApexLineChartMinComponent,
  ApexLineChartTimeseriesComponent,
  ApexBarChartStackedComponent,
  NotificacionesComponent,
  PageLoaderComponent,
  SearchToolbarComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AppPipesModule,
    ChartsModule,
    NgApexchartsModule,
    MaterialModule,
    OverlayModule
  ],
  exports: [...components]
})
export class ComponentsModule {}
