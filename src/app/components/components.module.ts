import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

// Componentes
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TablaBeneficiariosComponent } from './tabla-beneficiarios/tabla-beneficiarios.component';
import { FormIngresosComponent } from './form-ingresos/form-ingresos.component';
import { FormEgresosComponent } from './form-egresos/form-egresos.component';
import { FormCambiosComponent } from './form-cambios/form-cambios.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { InfoBeneficiarioComponent } from './modals/info-beneficiario/info-beneficiario.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { ModalActualizacionesComponent } from './modals/modal-actualizaciones/modal-actualizaciones.component';
import { DialogAcercaDeComponent } from './dialogs/dialog-acerca-de/dialog-acerca-de.component';
import { MaterialModule } from '../material/material.module';
import { ApexPieChartComponent } from './apexchart/apex-pie-chart/apex-pie-chart.component';
import { ApexLineChartTimeseriesComponent } from './apexchart/apex-line-chart-timeseries/apex-line-chart-timeseries.component';
import { ApexLineChartMinComponent } from './apexchart/apex-line-chart-min/apex-line-chart-min.component';
import { ApexBarChartStackedComponent } from './apexchart/apex-bar-chart-stacked/apex-bar-chart-stacked.component';
import { AppPipesModule } from '../pipes/app-pipes.module';
import { DialogFormIngresoComponent } from './dialogs/dialog-form-ingreso/dialog-form-ingreso.component';

const components = [
  HeaderComponent,
  SidebarComponent,
  TablaBeneficiariosComponent,
  FormIngresosComponent,
  FormEgresosComponent,
  FormCambiosComponent,
  PieChartComponent,
  InfoBeneficiarioComponent,
  LineChartComponent,
  ModalActualizacionesComponent,
  DialogAcercaDeComponent,
  ApexPieChartComponent,
  ApexLineChartMinComponent,
  ApexLineChartTimeseriesComponent,
  ApexBarChartStackedComponent,
  DialogFormIngresoComponent
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
    MaterialModule
  ],
  exports: [...components]
})
export class ComponentsModule {}
