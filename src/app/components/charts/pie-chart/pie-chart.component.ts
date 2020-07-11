import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @Input() bgColors = ['#4de2b8', '#eee'];
  @Input() holeSize = 89;
  @Input() legendDisplay = false;

  // Pie
  pieChartOptions: ChartOptions = {
    aspectRatio: 2,
    cutoutPercentage: this.holeSize, // amplía el hoyo dentro de dona
    responsive: true,
    legend: {
      display: this.legendDisplay,
      position: 'left',
      align: 'end',
      labels: {
        fontColor: 'hsl(0, 0%, 25%)',
        usePointStyle: true,
        padding: 15,
        boxWidth: 8
      }
    },
    elements: {
      line: {
        borderWidth: 2 // Para lineas
      },
      arc: {
        borderWidth: 0 // Linea que separa cada sección dentro de un PIE
      }
    }
  };
  pieChartLabels: Label[] = [
    'Mujeres gestantes',
    'Niñas',
    'Niños'
    // 'Extranjeros'
  ];
  @Input() pieChartData: number[] = [1250, 1688];
  pieChartType: ChartType = 'doughnut';
  pieChartLegend = true;
  pieChartPlugins = [];
  pieChartColors = [{ backgroundColor: this.bgColors }];

  @ViewChild('piechart', { static: true }) piechart: BaseChartDirective;

  constructor() {}

  ngOnInit() {
    this.actualizarConfPadre();
  }

  actualizarConfPadre() {
    if (this.piechart) {
      this.pieChartColors = [{ backgroundColor: this.bgColors }];
      this.pieChartOptions.cutoutPercentage = this.holeSize;
      this.pieChartOptions.legend.display = this.legendDisplay;
    }
  }
}
