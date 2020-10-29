import { Component, OnInit } from "@angular/core";
import { Uds } from "src/app/models/uds.model";
import { UdsService } from "src/app/services/uds.service";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { Beneficiario } from "src/app/models/beneficiario.model";
import { SocketService } from "src/app/services/socketIo/socket.service";
import { PageLoadingService } from "src/app/services/page-loading.service";

declare var moment: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
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
  ingresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  egresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  meses = [
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  mesesFull = [
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciciembre",
  ];

  // Segregados específicos
  enConcurrencia = 0;
  mgAdolescente = 0;
  caliMayoresDe2Anios = 0;
  daguaMayoresDe2Anios = 0;
  colombianosSinDoc = 0;

  // Datos de UDS
  udsCali: Uds[] = [];
  udsDagua: Uds[] = [];

  hoy = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY");
  cargandoDatos = false;
  loader = this.ngxLoader.useRef("http");

  constructor(
    private pageLoading$: PageLoadingService,
    private uds$: UdsService,
    private ngxLoader: LoadingBarService,
    private socket: SocketService
  ) {}

  ngOnInit() {
    const datosUdsLocal = localStorage.getItem("datosDashboard");
    if (datosUdsLocal === null) {
      this.obtenerDatos();
    } else {
      this.datosUds = JSON.parse(localStorage.getItem("datosDashboard"));
      this.contarCupos(this.datosUds);
      this.obtenerDatosDeBeneficiarios(this.datosUds);
      this.separarUds_municipios(this.datosUds);
      this.pageLoading$.loadingPages.emit(false);
    }
  }

  // prueba SOCKET ****************************************************************************************
  crearNotificaciongGeneral() {
    const notificacion: any = {
      titulo: "Beneficiarios",
      descripcion: "Se ha marcado al beneficiario x como dato sensible",
      general: true,
    };
    this.socket.emit("crearNotificacionGeneral", notificacion);
  }
  crearNotificaciongUsuario() {
    const notificacion: any = {
      titulo: "Novedades",
      descripcion: "Brayan Devia ha sido vinculado",
      paraUsuarios: ["5efb8aa1a134b929e8b7cfc8"],
    };
    this.socket.emit("notificarUsuario", notificacion);
  }
  // prueba SOCKET ****************************************************************************************

  obtenerDatos() {
    this.cargandoDatos = true;
    this.udsCali = [];
    this.udsDagua = [];
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
          localStorage.setItem("datosDashboard", JSON.stringify(this.datosUds));
          this.pageLoading$.loadingPages.emit(false);
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  separarUds_municipios(uds: any): void {
    uds.forEach((unidad: any) => {
      if (unidad.ubicacion === "Cali") {
        unidad.beneficiarios = this.filtrarNoActivosEnUds(unidad.beneficiarios);
        this.udsCali.push(unidad);
      } else {
        unidad.beneficiarios = this.filtrarNoActivosEnUds(unidad.beneficiarios);
        this.udsDagua.push(unidad);
      }
    });
    this.udsCali = this.ordenarUds(this.udsCali);
    this.udsDagua = this.ordenarUds(this.udsDagua);
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
    const filtroVinculado = { estado: "Vinculado" };
    const filtroPendiente = { estado: "Pendiente desvincular" };
    const filtroDS = { estado: "Dato sensible" };
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

  obtenerDatosDeBeneficiarios(uds: any) {
    this.mgAdolescente = 0;
    this.ingresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.egresosPorMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.totalSexoHombre = 0;
    this.totalSexoHombre = 0;
    this.totalSexoOtro = 0;
    this.totalLactantes = 0;
    this.totalMayoresSeisMeses = 0;
    this.totalMG = 0;
    this.totalDiscapacitados = 0;
    this.totalEtnia = 0;
    this.totalVictima = 0;
    this.totalExtranjeros = 0;
    this.enConcurrencia = 0;
    this.colombianosSinDoc = 0;
    uds.forEach((unidad: any, i) => {
      unidad.beneficiarios.forEach((beneficiario: any) => {
        this.contarPoblacion(beneficiario);
        this.contarIngresosPorMes(beneficiario);
        this.contarMgAdolescente(beneficiario);
        this.contarTipoBeneficiario(beneficiario);
        this.contarSexo(beneficiario);
        this.contarEnConcurrencia(beneficiario);
        this.contarColombianosSinDoc(beneficiario);
      });
    });
    this.limpiarIngresosEgresos();
  }

  limpiarIngresosEgresos() {
    const mesActual = moment(this.hoy, "DD/MM/YYYY").format("MMM");

    this.meses.forEach((mes, i) => {
      mes = mes.toLowerCase() + ".";
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

  contarCupos(uds: any) {
    this.totalCaliVinculados = 0;
    this.totalCaliDS = 0;
    this.totalDaguaVinculados = 0;
    this.totalDaguaDS = 0;
    let contador = 0;
    uds.forEach((unidad: any) => {
      if (unidad.ubicacion === "Cali") {
        unidad.beneficiarios.forEach((beneficiario: any) => {
          this.totalCaliVinculados += this.contarActivos(beneficiario);
          this.totalCaliDS += this.contarDatosSensibles(beneficiario);
          this.caliMayoresDe2Anios += this.contarMayoresDe2Anios(beneficiario);
        });
      } else {
        unidad.beneficiarios.forEach((beneficiario: any) => {
          this.totalDaguaVinculados += this.contarActivos(beneficiario);
          this.totalDaguaDS += this.contarDatosSensibles(beneficiario);
          this.daguaMayoresDe2Anios += this.contarMayoresDe2Anios(beneficiario);
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

  contarActivos(beneficiario: Beneficiario) {
    const estado = beneficiario.estado;
    if (estado === "Vinculado" || estado === "Pendiente desvincular") {
      return 1;
    } else {
      return 0;
    }
  }

  contarDatosSensibles(beneficiario: Beneficiario) {
    const estado = beneficiario.estado;
    if (estado === "Dato sensible") {
      return 1;
    } else {
      return 0;
    }
  }

  contarPoblacion(beneficiario: Beneficiario) {
    // datos
    const estado = beneficiario.estado;
    const tipoDoc = beneficiario.tipoDoc;

    if (
      (beneficiario.autorreconocimiento !== "Ninguno" &&
        estado === "Vinculado") ||
      (beneficiario.autorreconocimiento !== "Ninguno" &&
        estado === "Dato sensible") ||
      (beneficiario.autorreconocimiento !== "Ninguno" &&
        estado === "Pendiente desvincular")
    ) {
      this.totalEtnia += 1;
      // console.log(beneficiario);
    }
    if (
      (beneficiario.discapacidad && estado === "Vinculado") ||
      (beneficiario.discapacidad && estado === "Dato sensible") ||
      (beneficiario.discapacidad && estado === "Pendiente desvincular")
    ) {
      this.totalDiscapacitados += 1;
      // console.log(beneficiario);
    }
    if (
      (tipoDoc === "SD" && estado === "Vinculado") ||
      (tipoDoc === "SD" && estado === "Dato sensible") ||
      (tipoDoc === "SD" && estado === "Pendiente desvincular")
    ) {
      this.totalExtranjeros += 1;
      // console.log(beneficiario);
    }
  }

  contarTipoBeneficiario(beneficiario: Beneficiario) {
    // datos
    const nacimiento = moment(beneficiario.nacimiento, "DD/MM/YYYY");
    const edadMeses = this.hoy.diff(nacimiento, "months");
    const estado = beneficiario.estado;

    if (
      (edadMeses < 6 && estado === "Vinculado") ||
      (edadMeses < 6 && estado === "Dato sensible") ||
      (edadMeses < 6 && estado === "Pendiente desvincular")
    ) {
      this.totalLactantes += 1;
      // console.log(beneficiario);
    }
    if (
      (edadMeses >= 6 && edadMeses <= 120 && estado === "Vinculado") ||
      (edadMeses >= 6 && edadMeses <= 120 && estado === "Dato sensible") ||
      (edadMeses >= 6 && edadMeses <= 120 && estado === "Pendiente desvincular")
    ) {
      // 120 meses (10 años)
      this.totalMayoresSeisMeses += 1;
      // console.log(beneficiario);
    }
    if (
      (edadMeses > 120 && estado === "Vinculado") ||
      (edadMeses > 120 && estado === "Dato sensible") ||
      (edadMeses > 120 && estado === "Pendiente desvincular")
    ) {
      this.totalMG += 1;
    }
  }

  contarSexo(beneficiario: Beneficiario) {
    // datos
    const sexo = beneficiario.sexo;
    const estado = beneficiario.estado;

    if (
      (sexo === "Hombre" && estado === "Vinculado") ||
      (sexo === "Hombre" && estado === "Dato sensible") ||
      (sexo === "Hombre" && estado === "Pendiente desvincular")
    ) {
      this.totalSexoHombre += 1;
      // console.log(beneficiario);
    }
    if (
      (sexo === "Mujer" && estado === "Vinculado") ||
      (sexo === "Mujer" && estado === "Dato sensible") ||
      (sexo === "Mujer" && estado === "Pendiente desvincular")
    ) {
      this.totalSexoMujer += 1;
      // console.log(beneficiario);
    }
    if (
      (sexo === "Otro" && estado === "Vinculado") ||
      (sexo === "Otro" && estado === "Dato sensible") ||
      (sexo === "Otro" && estado === "Pendiente desvincular")
    ) {
      this.totalSexoOtro += 1;
      // console.log(beneficiario);
    }
  }

  contarIngresosPorMes(beneficiario: Beneficiario) {
    // Formateo fechas
    const mesIngreso = moment(beneficiario.ingreso, "DD/MM/YYYY").format("MMM");
    const mesEgreso = moment(beneficiario.egreso, "DD/MM/YYYY").format("MMM");
    // Asigno contador en cada mes
    this.meses.forEach((item: string, i) => {
      const mes = item.toLowerCase() + ".";
      if (mesIngreso === mes) {
        this.ingresosPorMes[i] += 1;
      }
      if (mesEgreso === mes) {
        this.egresosPorMes[i] += 1;
      }
    });
  }

  contarEnConcurrencia(beneficiario: Beneficiario) {
    if (beneficiario.estado === "Concurrencia") {
      this.enConcurrencia += 1;
    }
  }

  contarMgAdolescente(beneficiario: Beneficiario) {
    // Tomo fechas
    const nacimiento = moment(beneficiario.nacimiento, "DD/MM/YYYY");
    const edadAnios = this.hoy.diff(nacimiento, "years");

    if (beneficiario.estado === "Vinculado") {
      if (edadAnios >= 10 && edadAnios < 18) {
        this.mgAdolescente += 1;
      }
    }
    if (beneficiario.estado === "Dato sensible") {
      if (edadAnios >= 10 && edadAnios < 18) {
        this.mgAdolescente += 1;
      }
    }
  }

  contarMayoresDe2Anios(beneficiario: Beneficiario) {
    // Tomo fechas
    const nacimiento = moment(beneficiario.nacimiento, "DD/MM/YYYY");
    const edadAnios = this.hoy.diff(nacimiento, "years");
    const estado = beneficiario.estado;
    const e = ["Vinculado", "Pendiente desvincular", "Dato sensible"];

    if (
      (estado === e[0] && edadAnios >= 2 && edadAnios <= 10) ||
      (estado === e[1] && edadAnios >= 2 && edadAnios <= 10) ||
      (estado === e[2] && edadAnios >= 2 && edadAnios <= 10)
    ) {
      return 1;
    } else {
      return 0;
    }
  }

  contarColombianosSinDoc(beneficiario: Beneficiario) {
    // Tomo fechas
    const paisNacimiento = beneficiario.paisNacimiento;
    const tipoDoc = beneficiario.tipoDoc;
    const estado = beneficiario.estado;
    const e = ["Vinculado", "Pendiente desvincular", "Dato sensible"];

    if (
      (estado === e[0] && paisNacimiento === "Colombia" && tipoDoc === "SD") ||
      (estado === e[1] && paisNacimiento === "Colombia" && tipoDoc === "SD") ||
      (estado === e[2] && paisNacimiento === "Colombia" && tipoDoc === "SD")
    ) {
      this.colombianosSinDoc++;
    }
  }
}
