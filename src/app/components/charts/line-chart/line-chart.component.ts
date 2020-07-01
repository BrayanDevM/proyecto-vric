import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() ingresos = [];
  @Input() egresos = [];
  @Input() meses = [];
  public lineChartData: ChartDataSets[] = [
    { data: this.egresos, label: 'Egresos' },
    // { data: [5, 2, 15, 8, 6, 11, 9], label: 'Adultos' },
    {
      data: this.ingresos,
      label: 'Ingresos'
      // yAxisID: 'y-axis-1'
    }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 8,
        usePointStyle: true
      }
    },
    elements: {
      point: {
        radius: 2 // Puntos en cada data
      },
      line: {
        borderWidth: 1, // grosor de lineas
        stepped: false,
        fill: true // Colorea fondo de lineas (no borde)
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [
        {
          gridLines: {
            color: '#eee'
          }
        }
      ],
      yAxes: [{}]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 1,
          label: {
            enabled: true,
            fontColor: 'green',
            content: 'LineAnno'
          }
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    {
      // grey
      backgroundColor: 'rgba(253, 73, 98, .2)',
      borderColor: 'rgb(253, 73, 98)'
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    // {
    //   // dark grey
    //   backgroundColor: 'rgba(246, 218, 109, .2)',
    //   borderColor: '#f6da6d'
    //   // pointBackgroundColor: 'rgba(77,83,96,1)',
    //   // pointBorderColor: '#fff',
    //   // pointHoverBackgroundColor: '#fff',
    //   // pointHoverBorderColor: 'rgba(77,83,96,1)'
    // },
    {
      // red
      backgroundColor: 'rgba(77, 226, 184, .2)',
      borderColor: '#4de2b8'
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  // public lineChartPlugins = [pluginAnnotations];

  @ViewChild('lineChart', { static: true }) lineChart: BaseChartDirective;

  constructor() {}

  ngOnInit() {
    if (this.lineChart) {
      // for (let i = 0; i < this.ingresos.length; i++) {
      //   // const ingresos = this.ingresos[i];
      //   if (this.ingresos[i] === 0 && this.egresos[i] === 0) {
      //     this.meses.splice(i, 0);
      //     this.ingresos.splice(i, 0);
      //     this.egresos.splice(i, 0);
      //     console.log(`ingreso y egresos en pos ${i}, están en 0, removido`);
      //     console.log(`mes en pos ${i}: ${this.meses[i]} removido`);
      //   }
      // }

      // console.log(this.meses, 'meses');
      // console.log(this.ingresos, 'ingresos');
      // console.log(this.egresos, 'egresos');
      this.lineChartData[0].data = this.egresos;
      this.lineChartData[1].data = this.ingresos;
      this.lineChartLabels = this.meses;
    }
  }
}
