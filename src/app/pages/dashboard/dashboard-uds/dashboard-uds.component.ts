import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { UdsService } from 'src/app/services/uds.service';
import { Uds } from 'src/app/models/uds.model';
declare var moment: any;

@Component({
  selector: 'app-dashboard-uds',
  templateUrl: './dashboard-uds.component.html',
  styleUrls: ['./dashboard-uds.component.css']
})
export class DashboardUdsComponent implements OnInit {
  hoy = moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY');

  // datos UDS
  nombre = 'Unidad de Servicio';
  codigo = 0;
  cupos = 0;

  // total por estado
  totalVinculados = 0;
  totalDesvinculados = 0;
  totalPendientes = 0;
  totalConcurrencia = 0;
  totalDS = 0;

  // total por sexo
  totalHombres = 0;
  totalMujeres = 0;

  // Segregado por población
  totalLactantes = 0;
  totalMayoresSeisMeses = 0;
  totalMG = 0;

  // Segregado por fecha
  ingresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  egresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  meses = [
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
  mostrarGraficaLinea = false;

  // Segregados específicos
  conDiscapacidad = 0;

  mgAdolescente = 0;

  constructor(private rutaActual: ActivatedRoute, private uds$: UdsService) {}

  ngOnInit(): void {
    this.obtenerUds_beneficiarios().then((unidad: Uds) => {
      this.cupos = unidad.cupos;
      this.nombre = unidad.nombre;
      this.codigo = unidad.codigo;
      this.contarCupos(unidad.beneficiarios);
      unidad.beneficiarios.forEach((beneficiario: Beneficiario) => {
        this.contarTipoBeneficiario(beneficiario);
        this.contarIngresosPorMes(beneficiario);
        this.contarConDiscapacidad(beneficiario);
        this.contarMgAdolescente(beneficiario);
        this.mostrarGraficaLinea = true;
      });
    });
  }

  obtenerUds_beneficiarios() {
    return new Promise((resolve, reject) => {
      this.rutaActual.params.subscribe((params: Params) => {
        this.uds$
          .obtenerUnidad_beneficiarios(params.id)
          .subscribe((resp: any) => {
            if (resp.ok) {
              resolve(resp.unidad);
            } else {
              reject(resp);
            }
          });
      });
    });
  }

  contarCupos(beneficiarios: Beneficiario[]) {
    beneficiarios.forEach(beneficiario => {
      switch (beneficiario.estado) {
        case 'Vinculado':
          this.totalVinculados++;
          break;
        case 'Desvinculado':
          this.totalDesvinculados++;
          break;
        case 'Dato sensible':
          this.totalDS++;
          break;
        case 'Concurrencia':
          this.totalConcurrencia++;
          break;
        default:
          this.totalPendientes++;
          break;
      }
    });
  }

  contarTipoBeneficiario(beneficiario: Beneficiario) {
    // datos
    const nacimiento = moment(beneficiario.nacimiento, 'DD/MM/YYYY');
    const edadMeses = this.hoy.diff(nacimiento, 'months');
    const estado = beneficiario.estado;

    if (
      (edadMeses < 6 && estado === 'Vinculado') ||
      (edadMeses < 6 && estado === 'Dato sensible') ||
      (edadMeses < 6 && estado === 'Pendiente desvincular')
    ) {
      this.totalLactantes += 1;
      // console.log(beneficiario);
    }
    if (
      (edadMeses >= 6 && edadMeses <= 120 && estado === 'Vinculado') ||
      (edadMeses >= 6 && edadMeses <= 120 && estado === 'Dato sensible') ||
      (edadMeses >= 6 && edadMeses <= 120 && estado === 'Pendiente desvincular')
    ) {
      // 120 meses (10 años)
      this.totalMayoresSeisMeses += 1;
      // console.log(beneficiario);
    }
    if (
      (edadMeses > 120 && estado === 'Vinculado') ||
      (edadMeses > 120 && estado === 'Dato sensible') ||
      (edadMeses > 120 && estado === 'Pendiente desvincular')
    ) {
      this.totalMG += 1;
    }
  }

  contarIngresosPorMes(beneficiario: Beneficiario) {
    // Formateo fechas
    const mesIngreso = moment(beneficiario.ingreso, 'DD/MM/YYYY').format('MMM');
    const mesEgreso = moment(beneficiario.egreso, 'DD/MM/YYYY').format('MMM');

    // Asigno contador en cada mes
    this.meses.forEach((item: string, i) => {
      const mes = item.toLowerCase() + '.';
      if (beneficiario.estado === 'Vinculado' && mesIngreso === mes) {
        this.ingresosPorMes[i] += 1;
      }
      if (beneficiario.estado === 'Desvinculado' && mesEgreso === mes) {
        this.egresosPorMes[i] += 1;
      }
    });
  }

  contarConDiscapacidad(beneficiario: Beneficiario) {
    if (beneficiario.estado === 'Vinculado' && beneficiario.discapacidad) {
      this.conDiscapacidad += 1;
    }
    if (beneficiario.estado === 'Dato sensible' && beneficiario.discapacidad) {
      this.conDiscapacidad += 1;
    }
  }

  contarMgAdolescente(beneficiario: Beneficiario) {
    // Tomo fechas
    const nacimiento = moment(beneficiario.nacimiento, 'DD/MM/YYYY');
    const edadAnios = this.hoy.diff(nacimiento, 'years');

    if (beneficiario.estado === 'Vinculado') {
      if (edadAnios >= 10 && edadAnios < 18) {
        this.mgAdolescente += 1;
      }
    }
    if (beneficiario.estado === 'Dato sensible') {
      if (edadAnios >= 10 && edadAnios < 18) {
        this.mgAdolescente += 1;
      }
    }
  }
}
