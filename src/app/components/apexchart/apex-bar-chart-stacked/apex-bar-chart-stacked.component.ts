import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  ApexYAxis,
  ApexGrid
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  colors: string[];
};

@Component({
  selector: 'app-apex-bar-chart-stacked',
  templateUrl: './apex-bar-chart-stacked.component.html',
  styleUrls: ['./apex-bar-chart-stacked.component.css']
})
export class ApexBarChartStackedComponent implements OnInit, OnChanges {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() titulo = 'Titulo';
  @Input() subtitulo = 'Sub';
  @Input() series: number[] = [];
  @Input() seriesNombre: string[] = [];
  @Input() categoria: string[] = [];
  @Input() colores: string[] = [];
  totalSeries = 0;
  data: any[] = [];
  valorPopular = '';
  colorValorPopular = '';

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Mujer',
          data: [44]
        },
        {
          name: 'Hombre',
          data: [53]
        },
        {
          name: 'Otro',
          data: [12]
        }
      ],
      dataLabels: {
        enabled: false
      },
      colors: ['#c45194', '#da5c9c', '#f07bb2'],
      chart: {
        type: 'bar',
        height: 60,
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '100%',
          barHeight: '100%'
        }
      },
      stroke: {
        show: false,
        width: 0,
        colors: ['#fff']
      },
      grid: {
        show: false,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      xaxis: {
        categories: ['Sexo'],
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      tooltip: {
        y: {
          formatter: val => {
            return val + '';
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        show: false,
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
      }
    };
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    const series = [];
    this.series.forEach((serie, i) => {
      series.push({
        name: this.seriesNombre[i],
        data: [serie]
      });
    });
    this.totalSeries = this.totalValores(this.series);
    this.chartOptions.series = series;
    this.chartOptions.colors = this.colores;
    this.chartOptions.xaxis.categories = this.categoria;
    this.data = this.crearObjeto(this.series, this.seriesNombre, this.colores);
    this.buscarValorPopular(this.series);
  }

  crearObjeto(series: number[], labels: string[], colors: string[]) {
    const data = [];
    series.forEach((serie, i) => {
      data.push({
        serie,
        label: labels[i],
        color: colors[i],
        porcentaje: this.calcularPorcentaje(serie, this.totalSeries)
      });
    });
    return data;
  }

  totalValores(series: number[]) {
    let total = 0;
    series.forEach(valor => {
      total += valor;
    });

    return total;
  }

  calcularPorcentaje(valor: number, total: number) {
    const porcentaje: string = ((valor * 100) / total).toFixed(2);
    if (porcentaje === 'NaN') {
      return 0;
    } else {
      return porcentaje;
    }
  }

  buscarValorPopular(series: number[]): void {
    const valorMasAlto = Math.max.apply(null, series);
    const i = this.data.findIndex((obj: any) => obj.serie === valorMasAlto);
    if (valorMasAlto === 0) {
      this.valorPopular = '';
      this.colorValorPopular = '#464646';
    } else {
      this.valorPopular = this.data[i].label;
      this.colorValorPopular = this.data[i].color;
    }
  }
}
