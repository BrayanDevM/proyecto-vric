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
  unidadDeServicio: Uds;
  unidadCupos = 0;

  // total por estado
  totalVinculados = 0;
  totalDS = 0;

  // Segregado por población
  totalLactantes = 0;
  totalMayoresSeisMeses = 0;
  totalMG = 0;

  // Segregado por población vulnerable
  totalDiscapacitados = 0;
  totalEtnia = 0;
  totalVictima = 0;
  totalExtranjeros = 0;

  // Segregado por sexo
  totalSexoHombre = 0;
  totalSexoMujer = 0;
  totalSexoOtro = 0;

  // Segregado por fecha
  ingresosPorMes = [];
  egresosPorMes = [];
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
  mesesFull = [
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciciembre'
  ];

  // Segregado por datos especiales
  mgAdolescente = 0;
  mayoresDe2Anios = 0;
  enConcurrencia = 0;
  colombianosSinDoc = 0;

  constructor(private rutaActual: ActivatedRoute, private uds$: UdsService) {}

  ngOnInit(): void {
    this.obtenerUds_beneficiarios().then((unidad: Uds) => {
      this.unidadDeServicio = unidad;
      this.unidadCupos = unidad.cupos;
      this.contarIngresosPorMes(this.unidadDeServicio.beneficiarios);
      this.unidadDeServicio.beneficiarios.forEach(
        (beneficiario: Beneficiario) => {
          this.contarCupos(beneficiario);
          this.contarPoblacion(beneficiario);
          this.contarSexo(beneficiario);
          this.contarTipoBeneficiario(beneficiario);
          this.contarMgAdolescente(beneficiario);
          this.contarEnConcurrencia(beneficiario);
          this.contarMayoresDe2Anios(beneficiario);
        }
      );
      this.limpiarIngresosEgresos();
    });
  }

  obtenerUds_beneficiarios() {
    return new Promise((resolve, reject) => {
      this.rutaActual.params.subscribe((params: Params) => {
        this.uds$
          .obtenerUnidad_beneficiarios(params.unidadId)
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

  contarCupos(beneficiario: Beneficiario) {
    const estado = beneficiario.estado;
    if (estado === 'Vinculado' || estado === 'Pendiente desvincular') {
      this.totalVinculados += 1;
    }
    if (estado === 'Dato sensible') {
      this.totalDS += 1;
    }
  }

  contarPoblacion(beneficiario: Beneficiario) {
    const estado = beneficiario.estado;
    const autorreconocimiento = beneficiario.autorreconocimiento;
    const tipoDoc = beneficiario.tipoDoc;
    if (
      (autorreconocimiento !== 'Ninguno' && estado === 'Vinculado') ||
      (autorreconocimiento !== 'Ninguno' && estado === 'Dato sensible') ||
      (autorreconocimiento !== 'Ninguno' && estado === 'Pendiente desvincular')
    ) {
      this.totalEtnia += 1;
      // console.log(beneficiario);
    }
    if (
      (beneficiario.discapacidad && estado === 'Vinculado') ||
      (beneficiario.discapacidad && estado === 'Dato sensible') ||
      (beneficiario.discapacidad && estado === 'Pendiente desvincular')
    ) {
      this.totalDiscapacitados += 1;
      // console.log(beneficiario);
    }
    if (
      (tipoDoc === 'SD' && estado === 'Vinculado') ||
      (tipoDoc === 'SD' && estado === 'Dato sensible') ||
      (tipoDoc === 'SD' && estado === 'Pendiente desvincular')
    ) {
      this.totalExtranjeros += 1;
      // console.log(beneficiario);
    }
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
      this.totalMayoresSeisMeses += 1;
      // console.log(beneficiario);
    }
    if (
      (edadMeses > 120 && estado === 'Vinculado') ||
      (edadMeses > 120 && estado === 'Dato sensible') ||
      (edadMeses > 120 && estado === 'Pendiente desvincular')
    ) {
      this.totalMG += 1;
      // console.log(beneficiario);
    }
  }
  contarSexo(beneficiario: Beneficiario) {
    // datos
    const sexo = beneficiario.sexo;
    const estado = beneficiario.estado;

    if (
      (sexo === 'Hombre' && estado === 'Vinculado') ||
      (sexo === 'Hombre' && estado === 'Dato sensible') ||
      (sexo === 'Hombre' && estado === 'Pendiente desvincular')
    ) {
      this.totalSexoHombre += 1;
      // console.log(beneficiario);
    }
    if (
      (sexo === 'Mujer' && estado === 'Vinculado') ||
      (sexo === 'Mujer' && estado === 'Dato sensible') ||
      (sexo === 'Mujer' && estado === 'Pendiente desvincular')
    ) {
      this.totalSexoMujer += 1;
      // console.log(beneficiario);
    }
    if (
      (sexo === 'Otro' && estado === 'Vinculado') ||
      (sexo === 'Otro' && estado === 'Dato sensible') ||
      (sexo === 'Otro' && estado === 'Pendiente desvincular')
    ) {
      this.totalSexoOtro += 1;
      // console.log(beneficiario);
    }
  }

  contarIngresosPorMes(beneficiarios: Beneficiario[]) {
    let contador = 0;
    const ingresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const egresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    beneficiarios.forEach(beneficiario => {
      // Formateo fechas
      const mesIngreso = moment(beneficiario.ingreso, 'DD/MM/YYYY').format(
        'MMM'
      );
      const mesEgreso = moment(beneficiario.egreso, 'DD/MM/YYYY').format('MMM');

      // Asigno contador en cada mes
      this.meses.forEach((item: string, i) => {
        const mes = item.toLowerCase() + '.';
        if (mesIngreso === mes) {
          ingresosPorMes[i] += 1;
        }
        if (mesEgreso === mes) {
          egresosPorMes[i] += 1;
        }
      });
      contador++;
      if (contador === beneficiarios.length) {
        this.ingresosPorMes = ingresosPorMes;
        this.egresosPorMes = egresosPorMes;
      }
    });
  }

  limpiarIngresosEgresos() {
    const mesActual = moment(this.hoy, 'DD/MM/YYYY').format('MMM');

    this.meses.forEach((mes, i) => {
      mes = mes.toLowerCase() + '.';
      if (mes === mesActual) {
        // remuevo datos de los meses que aún no llegan
        // y el primer elemento (cuando se cargan todos los beneficiarios masivamente)
        this.ingresosPorMes.splice(i + 1, 12);
        this.ingresosPorMes.splice(0, 1);

        this.egresosPorMes.splice(i + 1, 12);
        this.egresosPorMes.splice(0, 1);

        this.mesesFull.splice(0, 1);
        return;
      }
    });
  }

  contarEnConcurrencia(beneficiario: Beneficiario) {
    if (beneficiario.estado === 'Concurrencia') {
      this.enConcurrencia += 1;
    }
  }

  contarMgAdolescente(beneficiario: Beneficiario) {
    // Tomo fechas
    const nacimiento = moment(beneficiario.nacimiento, 'DD/MM/YYYY');
    const edadAnios = this.hoy.diff(nacimiento, 'years');
    const estado = beneficiario.estado;

    if (estado === 'Vinculado') {
      if (edadAnios >= 10 && edadAnios < 18) {
        this.mgAdolescente += 1;
      }
    }
    if (estado === 'Dato sensible') {
      if (edadAnios >= 10 && edadAnios < 18) {
        this.mgAdolescente += 1;
      }
    }
  }

  contarMayoresDe2Anios(beneficiario: Beneficiario) {
    // Tomo fechas
    const nacimiento = moment(beneficiario.nacimiento, 'DD/MM/YYYY');
    const edadAnios = this.hoy.diff(nacimiento, 'years');
    const estado = beneficiario.estado;
    const e = ['Vinculado', 'Pendiente desvincular', 'Dato sensible'];

    if (
      (estado === e[0] && edadAnios >= 2 && edadAnios <= 10) ||
      (estado === e[1] && edadAnios >= 2 && edadAnios <= 10) ||
      (estado === e[2] && edadAnios >= 2 && edadAnios <= 10)
    ) {
      this.mayoresDe2Anios++;
    }
  }

  contarColombianosSinDoc(beneficiario: Beneficiario) {
    // Tomo fechas
    const paisNacimiento = beneficiario.paisNacimiento;
    const tipoDoc = beneficiario.tipoDoc;
    const estado = beneficiario.estado;
    const e = ['Vinculado', 'Pendiente desvincular', 'Dato sensible'];

    if (
      (estado === e[0] && paisNacimiento === 'Colombia' && tipoDoc === 'SD') ||
      (estado === e[1] && paisNacimiento === 'Colombia' && tipoDoc === 'SD') ||
      (estado === e[2] && paisNacimiento === 'Colombia' && tipoDoc === 'SD')
    ) {
      this.colombianosSinDoc++;
    }
  }
}
