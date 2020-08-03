import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexPlotOptions,
  ApexLegend,
  ApexStates
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  colors: string[];
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  states: ApexStates;
  chart: ApexChart;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  labels: any;
};

@Component({
  selector: 'app-apex-pie-chart',
  templateUrl: './apex-pie-chart.component.html',
  styleUrls: ['./apex-pie-chart.component.css']
})
export class ApexPieChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() titulo = 'Titulo';
  @Input() series: number[];
  @Input() labels: string[];
  @Input() colors: string[];
  totalSeries = 0;
  data = [];

  constructor() {
    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      colors: ['#309794', '#4fd1c5'],
      chart: {
        type: 'donut',
        height: 180.5
      },
      legend: {
        show: false
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      dataLabels: {
        enabled: false
      },
      tooltip: {
        fillSeriesColor: false
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              name: {
                fontFamily: 'Inter, Roboto'
              },
              value: {
                fontFamily: 'Inter, Roboto'
              },
              total: {
                fontFamily: 'Inter, Roboto'
              }
            }
          },
          expandOnClick: false
        }
      },
      states: {
        hover: {
          filter: {
            type: 'none',
            value: 0
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 172.5
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.chartOptions.series = this.series;
    this.chartOptions.labels = this.labels;
    this.chartOptions.colors = this.colors;
    this.totalSeries = this.contarTotal(this.series);
    this.data = this.crearObjeto(this.series, this.labels, this.colors);
  }

  contarTotal(series: number[]) {
    let total = 0;
    series.forEach(serie => {
      total += serie;
    });
    return total;
  }

  crearObjeto(series: number[], labels: string[], colors: string[]) {
    const data = [];
    series.forEach((serie, i) => {
      data.push({
        serie,
        label: labels[i],
        color: colors[i],
        porcentaje: ((serie * 100) / this.totalSeries).toFixed(2)
      });
    });
    return data;
  }
}
