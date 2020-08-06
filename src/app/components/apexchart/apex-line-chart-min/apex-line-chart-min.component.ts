import { Component, OnInit, OnChanges, ViewChild, Input } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexTooltip,
  ApexTheme
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  colors: string[];
  theme: ApexTheme;
};

@Component({
  selector: 'app-apex-line-chart-min',
  templateUrl: './apex-line-chart-min.component.html',
  styleUrls: ['./apex-line-chart-min.component.css']
})
export class ApexLineChartMinComponent implements OnInit, OnChanges {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() titulo = 'TITULO';
  @Input() subtitulo = '';
  @Input() series: any[] = [];
  @Input() seriesNombre = '';
  @Input() colors: string[] = [];
  @Input() tiempoContador = 1000;
  @Input() actions = '';
  @Input() categorias: string[] = [
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
  ];
  totalData = 0;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Ingresos',
          data: [73, 31, 57, 65, 98, 45]
        }
      ],
      colors: ['#f05251'],
      chart: {
        height: 80,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          // muestra las opciones de gráfica (export)
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        // curve: "straight",
        // curve: "stepline",
        curve: 'smooth'
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
        categories: [
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic'
        ],
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        tooltip: {
          enabled: false
        }
      },
      yaxis: {
        show: false
      },
      theme: {
        mode: 'light'
      }
    };
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.chartOptions.series = [
      {
        name: this.seriesNombre,
        data: this.series
      }
    ];
    this.chartOptions.xaxis.categories = this.categorias;
    this.chartOptions.colors = this.colors;
    const countSeries = this.totalValores(this.series);
    this.contador(countSeries);
  }

  totalValores(series: number[]) {
    let total = 0;
    series.forEach(valor => {
      total += valor;
    });

    return total;
  }

  contador(valor: number) {
    // Cuanto tiempo tarda la animación
    const animationDuration = 2000;
    // Calcule cuánto tiempo debe durar cada "fotograma", si queremos actualizar la animación 60 veces por segundo
    const frameDuration = 1000 / 60;
    // Úselo para calcular cuántos fotogramas necesitamos para completar la animación.
    const totalFrames = Math.round(animationDuration / frameDuration);
    // Una función de facilitación que ralentiza el conteo a medida que avanza
    const easeOutQuad = (t: number) => t * (2 - t);

    let frame = 0;
    const countTo = valor;
    // Comienza la animación corriendo 60 frames por segundo
    const counter = setInterval(() => {
      frame++;
      // Calcula nuestro progreso como un valor entre 0 y 1
      // Pasa ese valor a nuestra función para obtener el progreso en una curva
      const progress = easeOutQuad(frame / totalFrames);
      // Use el valor de progreso para calcular el conteo actual
      const currentCount = Math.round(countTo * progress);

      // Si el recuento actual ha cambiado, actualice el elemento
      if (valor !== currentCount) {
        // actualiza variable global
        this.totalData = currentCount;
      }

      // Si hemos llegado a nuestro último fotograma, detenemos la animación.
      if (frame === totalFrames) {
        // Al finalizar devuelve el valor pero le resta 1, así que lo agregamos
        // Así al terminar queda el valor completo
        if (this.totalData > 0) {
          this.totalData++;
        }
        clearInterval(counter);
      }
    }, frameDuration);
  }

  contador2(duracion: number, valor: number) {
    // CONTADOR ANTIGUO (TARDA MUCHO) *******************************
    let i = 0;
    let intervalo: any;
    const contarHasta = valor;
    intervalo = setInterval(() => {
      if (i <= contarHasta) {
        this.totalData = i;
        i++;
      } else {
        clearInterval(intervalo);
      }
    }, duracion / contarHasta);
  }
}
