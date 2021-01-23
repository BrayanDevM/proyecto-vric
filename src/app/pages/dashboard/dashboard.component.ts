import { Component, OnInit } from '@angular/core';
import { Uds } from 'src/app/models/uds.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { SocketService } from 'src/app/services/socketIo/socket.service';
import { PageLoadingService } from 'src/app/services/page-loading.service';

declare const moment: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  hoy = moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY');
  loader = this.ngxLoader.useRef('http');
  cargandoDatos = false;
  estadosActivos = ['Vinculado', 'Pendiente vincular', 'Dato sensible'];

  // Datos de UDS
  C_uds: Uds[] = [];
  D_uds: Uds[] = [];

  // Contadores de Dagua: D
  D_cupos = 635;
  D_vinculados = 0;
  D_datosSensibles = 0;
  D_mayores_2anos = 0;

  // Contadores de Cali: C
  C_cupos = 1053;
  C_vinculados = 0;
  C_datosSensibles = 0;
  C_mayores_2anos = 0;
  vinculados = 0;

  // Totales
  cupos = 1688;
  lactantes = 0;
  datosSensibles = 0;
  mayores_6meses = 0;
  mujeresGest = 0;
  discapacitados = 0;
  etnicos = 0;
  victimas = 0;
  extranjeros = 0;
  sexoHombre = 0;
  sexoMujer = 0;
  sexoOtro = 0;
  enConcurrencia = 0;
  mgAdolescente = 0;
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
    private ngxLoader: LoadingBarService,
    private dashboard$: DashboardService
  ) {
    this.traerInfoBeneficiarios();
  }

  ngOnInit() {
    // const datosUdsLocal = localStorage.getItem("datosDashboard");
    // if (datosUdsLocal === null) {
    //   this.traerInfoBeneficiarios();
    // } else {
    //   this.datosUds = JSON.parse(localStorage.getItem("datosDashboard"));
    //   this.contarCupos(this.datosUds);
    //   this.obtenerDatosDeBeneficiarios(this.datosUds);
    //   this.separarUds_municipios(this.datosUds);
    //   this.pageLoading$.loadingPages.emit(false);
    // }
  }

  /**
   * 1. Consulta en la BD la información de beneficiarios
   * 2. Emite finalización de carga para ocultar loadingPage
   * 3. Ejecuta método que realiza el conteo de todas las variables
   * 4. Separa las UDS para supervisión individual
   * + 30% más rapida la respuesta con una ruta específica para Dashboard
   */
  traerInfoBeneficiarios() {
    this.cargandoDatos = true;
    this.dashboard$.obtenerDatos().subscribe((resp: any) => {
      if (resp.ok) {
        this.pageLoading$.loadingPages.emit(false);
        localStorage.setItem('datosDashboard', JSON.stringify(resp.uds));

        // realiza conteos con info
        this.realizarConteo(resp.uds);
        this.separarUds_municipios(resp.uds);
        this.cargandoDatos = false;
      }
    });
  }

  /**
   * Realiza el conteo de todas las variables
   * @param uds todas las uds con sus beneficiarios
   */
  realizarConteo(uds: any[]) {
    uds.forEach((unidad: any) => {
      unidad.beneficiarios.forEach(
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
            // ignora inactivos
            if (unidad.ubicacion === 'Cali') {
              this.C_vinculados += this.estaVinculado(estado);
              this.C_datosSensibles += this.esDatoSensible(estado);
              this.C_mayores_2anos += this.esMayorDe2Anos(nacimiento);
            } else {
              this.D_vinculados += this.estaVinculado(estado);
              this.D_datosSensibles += this.esDatoSensible(estado);
              this.D_mayores_2anos += this.esMayorDe2Anos(nacimiento);
            }
            this.vinculados += this.estaVinculado(estado);
            this.datosSensibles += this.esDatoSensible(estado);
            this.etnicos += this.tieneEtnia(autorreconocimiento);
            this.discapacitados += this.tieneDiscapacidad(discapacidad);
            this.extranjeros += this.esExtranjero(paisNacimiento);
            this.mgAdolescente += this.esMgAdolescente(nacimiento);
            this.lactantes += this.esLactante(nacimiento);
            this.mayores_6meses += this.esMayorDe_6meses(nacimiento);
            this.mujeresGest += this.esMujerGestante(nacimiento);
            this.sexoHombre += this.esSexoHombre(sexo);
            this.sexoMujer += this.esSexoMujer(sexo);
            this.sexoOtro += this.esSexoOtro(sexo);
            this.enConcurrencia += this.estaEnConcurrencia(estado);
            this.colombianosSD += this.esColombianoSD(paisNacimiento, tipoDoc);
          }
          // CONTADORES PARA GRÁFICAS LÍNEALES
          this.contarIngresosPorMes(ingreso, egreso);
        }
      );
    });
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
  contarIngresosPorMes(ingreso: string, egreso: string) {
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
        this.ingresos.splice(i + 1, 12);
        this.ingresos.splice(0, 1);

        this.egresos.splice(i + 1, 12);
        this.egresos.splice(0, 1);

        this.mesesFull.splice(0, 1);
        return;
      }
    });
  }

  // Métodos para ordenar UDS //////////////////////////////////////////////////////////////////////////////////
  separarUds_municipios(uds: any): void {
    uds.forEach((unidad: any) => {
      if (unidad.ubicacion === 'Cali') {
        unidad.beneficiarios = this.filtrarNoActivosEnUds(unidad.beneficiarios);
        this.C_uds.push(unidad);
      } else {
        unidad.beneficiarios = this.filtrarNoActivosEnUds(unidad.beneficiarios);
        this.D_uds.push(unidad);
      }
    });
    this.C_uds = this.ordenarUds(this.C_uds);
    this.D_uds = this.ordenarUds(this.D_uds);
  }

  ordenarUds(uds: Uds[]) {
    uds.sort((a, b) => {
      if (a.nombre > b.nombre) {
        return 1;
      }
      if (a.nombre < b.nombre) {
        return -1;
      }
      return 0;
    });
    return uds;
  }

  filtrarNoActivosEnUds(beneficiarios: any) {
    const filtroVinculado = { estado: 'Vinculado' };
    const filtroPendiente = { estado: 'Pendiente desvincular' };
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
    // Retorno nuevo arreglo con registros 'Pendientes desvincular'
    const pendientes = beneficiarios.filter((beneficiario: any) => {
      for (const registro in filtroPendiente) {
        if (beneficiario[registro] !== filtroPendiente[registro]) {
          return false;
        }
      }
      return true;
    });
    // Concateno ambos arreglos y retorno
    arreglo = vinculados.concat(pendientes);
    arreglo = arreglo.concat(DS);
    return arreglo;
  }
}
