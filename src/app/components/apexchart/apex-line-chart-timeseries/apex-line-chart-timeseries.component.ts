import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from 'ng-apexcharts';

@Component({
  selector: 'app-apex-line-chart-timeseries',
  templateUrl: './apex-line-chart-timeseries.component.html',
  styleUrls: ['./apex-line-chart-timeseries.component.css']
})
export class ApexLineChartTimeseriesComponent implements OnInit {
  public series: ApexAxisChartSeries;
  public chart: ApexChart;
  public dataLabels: ApexDataLabels;
  public markers: ApexMarkers;
  public title: ApexTitleSubtitle;
  public fill: ApexFill;
  public yaxis: ApexYAxis;
  public xaxis: ApexXAxis;
  public tooltip: ApexTooltip;
  public dataSeries: any[] = [
    [
      {
        date: '2014-01-01',
        value: 20000000
      },
      {
        date: '2014-01-02',
        value: 10379978
      },
      {
        date: '2014-01-03',
        value: 30493749
      },
      {
        date: '2014-01-04',
        value: 10785250
      },
      {
        date: '2014-01-05',
        value: 33901904
      },
      {
        date: '2014-01-06',
        value: 11576838
      },
      {
        date: '2014-01-07',
        value: 14413854
      },
      {
        date: '2014-01-08',
        value: 15177211
      },
      {
        date: '2014-01-09',
        value: 16622100
      }
    ]
  ];

  constructor() {
    this.initChartData();
  }

  ngOnInit(): void {}

  public initChartData(): void {
    let ts2 = 1484418600000;
    const dates = [];
    for (let i = 0; i < 9; i++) {
      ts2 = ts2 + 86400000;
      dates.push([ts2, this.dataSeries[0][i].value]);
    }

    this.series = [
      {
        name: 'XYZ MOTORS',
        data: dates
      }
    ];
    this.chart = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: 'Stock Price Movement',
      align: 'left'
    };
    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: val => {
          return (val / 1000000).toFixed(0);
        }
      },
      title: {
        text: 'Price'
      }
    };
    this.xaxis = {
      type: 'datetime'
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: val => {
          return (val / 1000000).toFixed(0);
        }
      }
    };
  }
}
