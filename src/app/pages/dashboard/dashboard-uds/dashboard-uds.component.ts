import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UdsService } from 'src/app/services/uds.service';
import { PageLoadingService } from 'src/app/services/page-loading.service';
import { DashboardService } from 'src/app/services/dashboard.service';
declare const moment: any;

@Component({
  selector: 'app-dashboard-uds',
  templateUrl: './dashboard-uds.component.html',
  styleUrls: ['./dashboard-uds.component.css']
})
export class DashboardUdsComponent implements OnInit {
  hoy = moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY');
  estadosActivos = ['Vinculado', 'Pendiente vincular', 'Dato sensible'];

  // datos UDS
  unidadId: string;
  nombreUnidad: string;
  cuposUnidad = 0;

  // Totales
  vinculados = 0;
  lactantes = 0;
  datosSensibles = 0;
  mayores_6meses = 0;
  mayores_2Anios = 0;
  mujeresGest = 0;
  mgAdolescente = 0;
  discapacitados = 0;
  etnicos = 0;
  victimas = 0;
  extranjeros = 0;
  sexoHombre = 0;
  sexoMujer = 0;
  sexoOtro = 0;
  enConcurrencia = 0;
  colombianosSD = 0;

  // Variables de gráficas
  ingresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ingresos = [];
  egresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  egresos = [];
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

  constructor(
    private pageLoading$: PageLoadingService,
    private rutaActual: ActivatedRoute,
    private uds$: UdsService,
    private dashboard$: DashboardService
  ) {
    this.obtenerIdUrl();
  }

  obtenerIdUrl() {
    this.rutaActual.params.subscribe((params: Params) => {
      this.traerInfoBeneficiarios(params.unidadId);
    });
  }

  ngOnInit(): void {}

  // NUEVA 50% MÁS RÁPIDA
  traerInfoBeneficiarios(unidadId: string) {
    this.dashboard$.obtenerDatos(`id=${unidadId}`).subscribe((resp: any) => {
      this.pageLoading$.loadingPages.emit(false);
      this.nombreUnidad = resp.uds[0].nombre;
      this.cuposUnidad = resp.uds[0].cupos;
      this.realizarConteo(resp.uds[0].beneficiarios);
    });
  }

  realizarConteo(beneficiarios: any[]) {
    beneficiarios.forEach(
      ({
        estado,
        nacimiento,
        autorreconocimiento,
        discapacidad,
        paisNacimiento,
        sexo,
        ingreso,
        egreso,
        tipoDoc
      }) => {
        if (this.estadosActivos.includes(estado)) {
          this.vinculados += this.estaVinculado(estado);
          this.datosSensibles += this.esDatoSensible(estado);
          this.etnicos += this.tieneEtnia(autorreconocimiento);
          this.discapacitados += this.tieneDiscapacidad(discapacidad);
          this.extranjeros += this.esExtranjero(paisNacimiento);
          this.lactantes += this.esLactante(nacimiento);
          this.mayores_6meses += this.esMayorDe_6meses(nacimiento);
          this.mayores_2Anios += this.esMayorDe2Anos(nacimiento);
          this.mgAdolescente += this.esMgAdolescente(nacimiento);
          this.mujeresGest += this.esMujerGestante(nacimiento);
          this.sexoHombre += this.esSexoHombre(sexo);
          this.sexoMujer += this.esSexoMujer(sexo);
          this.sexoOtro += this.esSexoOtro(sexo);
          this.enConcurrencia += this.estaEnConcurrencia(estado);
          this.colombianosSD += this.esColombianoSD(paisNacimiento, tipoDoc);
        }
        this.contarIngresosPorMes2(ingreso, egreso);
      }
    );
    this.ingresos = this.ingresosPorMes;
    this.egresos = this.egresosPorMes;
    this.limpiarIngresosEgresos(); // revisar, no limpia meses?
  }

  // Métodos que realizan comprobaciones y retornan 1 o 0 para sumar a conteos /////////////////////////////////
  estaVinculado(estado: string) {
    return estado === 'Vinculado' || estado === 'Pendiente desvincular' ? 1 : 0;
  }

  esDatoSensible(estado: string) {
    return estado === 'Dato sensible' ? 1 : 0;
  }

  tieneEtnia(autorreconocimiento: string) {
    return autorreconocimiento !== 'Ninguno' ? 1 : 0;
  }

  tieneDiscapacidad(discapacidad: boolean) {
    return discapacidad ? 1 : 0;
  }

  esExtranjero(paisNacimiento: string) {
    return paisNacimiento !== 'Colombia' ? 1 : 0;
  }

  esLactante(fechaNacimiento: string) {
    const nacimiento = moment(fechaNacimiento, 'DD/MM/YYYY');
    const edadMeses = this.hoy.diff(nacimiento, 'months');

    return edadMeses < 6 ? 1 : 0;
  }

  esMayorDe_6meses(fechaNacimiento: string) {
    const nacimiento = moment(fechaNacimiento, 'DD/MM/YYYY');
    const edadMeses = this.hoy.diff(nacimiento, 'months');

    return edadMeses >= 6 && edadMeses <= 120 ? 1 : 0;
  }

  esMujerGestante(fechaNacimiento: string) {
    const nacimiento = moment(fechaNacimiento, 'DD/MM/YYYY');
    const edadMeses = this.hoy.diff(nacimiento, 'months');

    return edadMeses > 120 ? 1 : 0;
  }

  esSexoHombre(sexo: string) {
    return sexo === 'Hombre' ? 1 : 0;
  }
  esSexoMujer(sexo: string) {
    return sexo === 'Mujer' ? 1 : 0;
  }
  esSexoOtro(sexo: string) {
    return sexo === 'Otro' ? 1 : 0;
  }

  estaEnConcurrencia(estado: string) {
    return estado === 'Concurrencia' ? 1 : 0;
  }

  esMgAdolescente(fechaNacimiento: string) {
    const nacimiento = moment(fechaNacimiento, 'DD/MM/YYYY');
    const edadAnios = this.hoy.diff(nacimiento, 'years');

    return edadAnios >= 10 && edadAnios < 18 ? 1 : 0;
  }

  esMayorDe2Anos(fechaNacimiento: string) {
    const nacimiento = moment(fechaNacimiento, 'DD/MM/YYYY');
    const edadAnios = this.hoy.diff(nacimiento, 'years');

    return edadAnios >= 2 && edadAnios <= 10 ? 1 : 0;
  }

  esColombianoSD(paisNacimiento: string, tipoDocumento: string) {
    return paisNacimiento === 'Colombia' && tipoDocumento === 'SD' ? 1 : 0;
  }

  // Métodos para realizar conteo de Ingresos/Egresos en gráficas //////////////////////////////////////////////
  contarIngresosPorMes2(ingreso: string, egreso: string) {
    // Formateo fechas
    const mesIngreso = moment(ingreso, 'DD/MM/YYYY').format('MMM');
    const mesEgreso = moment(egreso, 'DD/MM/YYYY').format('MMM');
    // Asigno contador en cada mes
    this.meses.forEach((item: string, i) => {
      const mes = item.toLowerCase() + '.';
      if (mesIngreso === mes) {
        this.ingresosPorMes[i]++;
      }
      if (mesEgreso === mes) {
        this.egresosPorMes[i]++;
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
}
