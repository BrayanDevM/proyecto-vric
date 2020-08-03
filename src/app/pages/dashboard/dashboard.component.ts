import { Component, OnInit, ViewChild } from '@angular/core';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

declare var moment: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Datos de contrato
  cuposCali = 1053;
  cuposDagua = 635;
  cuposTotal = 1688;

  // Segregado por cupos
  datosUds: any = [];

  // Vinculados
  totalCaliVinculados = 0;
  totalDaguaVinculados = 0;
  totalVinculados = 0;
  // Datos sensibles
  totalCaliDS = 0;
  totalDaguaDS = 0;
  totalDatosSensibles = 0;

  // Segregado por población
  totalMujeres = 0;
  totalHombres = 0;
  totalMG = 0;
  totalextranjeros = 0;

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
  enConcurrencia = 0;
  mgAdolescente = 0;

  // Datos de UDS
  udsCali: Uds[] = [];
  udsDagua: Uds[] = [];

  hoy = moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY');
  cargandoDatos = false;
  loader = this.ngxLoader.useRef('http');

  constructor(private uds$: UdsService, private ngxLoader: LoadingBarService) {}

  ngOnInit() {
    const datosUdsLocal = localStorage.getItem('datosDashboard');
    if (datosUdsLocal === null) {
      this.obtenerDatos();
    } else {
      this.datosUds = JSON.parse(localStorage.getItem('datosDashboard'));
      this.contarCupos(this.datosUds);
      this.obtenerDatosDeBeneficiarios(this.datosUds);
      this.separarUds_municipios(this.datosUds);
    }
  }

  obtenerDatos() {
    this.cargandoDatos = true;
    this.obtenerDatosUds_Beneficiarios().then(() => {
      this.contarCupos(this.datosUds);
      this.obtenerDatosDeBeneficiarios(this.datosUds);
      this.separarUds_municipios(this.datosUds);
      this.cargandoDatos = false;
    });
  }

  obtenerDatosUds_Beneficiarios(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.uds$.obtenerUds_beneficiarios().subscribe((resp: any) => {
        if (resp.ok) {
          // console.log(resp);
          this.datosUds = resp.uds;
          localStorage.setItem('datosDashboard', JSON.stringify(this.datosUds));
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  separarUds_municipios(uds: any): void {
    uds.forEach((unidad: any) => {
      if (unidad.ubicacion === 'Cali') {
        unidad.beneficiarios = this.filtrarNoActivosEnUds(unidad.beneficiarios);
        this.udsCali.push(unidad);
      } else {
        unidad.beneficiarios = this.filtrarNoActivosEnUds(unidad.beneficiarios);
        this.udsDagua.push(unidad);
      }
    });
  }

  filtrarNoActivosEnUds(beneficiarios: any) {
    const filtroVinculado = { estado: 'Vinculado' };
    const filtroDS = { estado: 'Dato sensible' };
    let arreglo = [];
    // Retorno nuevo arreglo con registros 'Vinculado'
    const vinculados = beneficiarios.filter((beneficiario: any) => {
      for (const registro in filtroVinculado) {
        if (beneficiario[registro] !== filtroVinculado[registro]) {
          return false;
        }
      }
      return true;
    });
    // Retorno nuevo arreglo con registros 'Dato sensible'
    const DS = beneficiarios.filter((beneficiario: any) => {
      for (const registro in filtroDS) {
        if (beneficiario[registro] !== filtroDS[registro]) {
          return false;
        }
      }
      return true;
    });
    // Concateno ambos arreglos y retorno
    arreglo = vinculados.concat(DS);
    return arreglo;
  }

  obtenerDatosDeBeneficiarios(uds: any) {
    this.mgAdolescente = 0;
    this.ingresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.egresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.totalMG = 0;
    this.totalMujeres = 0;
    this.totalHombres = 0;
    this.totalextranjeros = 0;
    uds.forEach((unidad: any) => {
      unidad.beneficiarios.forEach((beneficiario: any) => {
        this.contarPoblacion(beneficiario);
        this.contarIngresosPorMes(beneficiario);
        this.contarMgAdolescente(beneficiario);
        this.mostrarGraficaLinea = true;
      });
    });
  }

  contarCupos(uds: any) {
    this.totalCaliVinculados = 0;
    this.totalCaliDS = 0;
    this.totalDaguaVinculados = 0;
    this.totalDaguaDS = 0;
    let contador = 0;
    uds.forEach((unidad: any) => {
      if (unidad.ubicacion === 'Cali') {
        unidad.beneficiarios.forEach((beneficiario: any) => {
          if (
            beneficiario.estado === 'Vinculado' ||
            beneficiario.estado === 'Pendiente desvincular'
          ) {
            this.totalCaliVinculados += 1;
          }
          if (beneficiario.estado === 'Dato sensible') {
            this.totalCaliDS += 1;
          }
        });
      } else {
        unidad.beneficiarios.forEach((beneficiario: any) => {
          if (
            beneficiario.estado === 'Vinculado' ||
            beneficiario.estado === 'Pendiente desvincular'
          ) {
            this.totalDaguaVinculados += 1;
          }
          if (beneficiario.estado === 'Dato sensible') {
            this.totalDaguaDS += 1;
          }
        });
      }
      contador++;
      if (contador === uds.length) {
        this.totalVinculados =
          this.totalCaliVinculados + this.totalDaguaVinculados;
        this.totalDatosSensibles = this.totalCaliDS + this.totalDaguaDS;
      }
    });
  }

  contarPoblacion(beneficiario: any) {
    // datos
    const nacimiento = moment(beneficiario.nacimiento, 'DD/MM/YYYY');
    const edadAnios = this.hoy.diff(nacimiento, 'years');
    const sexo = beneficiario.sexo;
    const estado = beneficiario.estado;
    const tipoDoc = beneficiario.tipoDoc;

    if (
      (sexo === 'Hombre' && edadAnios <= 5 && estado === 'Vinculado') ||
      (sexo === 'Hombre' && edadAnios <= 5 && estado === 'Dato sensible')
    ) {
      this.totalHombres += 1;
      // console.log(beneficiario);
    }
    if (
      (sexo === 'Mujer' && edadAnios <= 5 && estado === 'Vinculado') ||
      (sexo === 'Mujer' && edadAnios <= 5 && estado === 'Dato sensible')
    ) {
      this.totalMujeres += 1;
      // console.log(beneficiario);
    }
    if (
      (edadAnios > 5 && estado === 'Vinculado') ||
      (edadAnios > 5 && estado === 'Dato sensible')
    ) {
      this.totalMG += 1;
      // console.log(beneficiario);
    }
    if (
      (tipoDoc === 'SD' && estado === 'Vinculado') ||
      (tipoDoc === 'SD' && estado === 'Dato sensible')
    ) {
      this.totalextranjeros += 1;
      // console.log(beneficiario);
    }
  }

  contarIngresosPorMes(beneficiario: any) {
    this.mostrarGraficaLinea = false;
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

  contarConDiscapacidad(beneficiario: any) {
    this.conDiscapacidad = 0;
    if (beneficiario.estado === 'Vinculado' && beneficiario.discapacidad) {
      this.conDiscapacidad += 1;
    }
    if (beneficiario.estado === 'Dato sensible' && beneficiario.discapacidad) {
      this.conDiscapacidad += 1;
    }
  }

  contarEnConcurrencia(beneficiario: any) {
    this.enConcurrencia = 0;
    if (beneficiario.estado === 'Concurrencia') {
      this.enConcurrencia += 1;
    }
  }

  contarMgAdolescente(beneficiario: any) {
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
