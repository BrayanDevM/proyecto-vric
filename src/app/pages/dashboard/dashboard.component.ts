import { Component, OnInit } from '@angular/core';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { Uds } from 'src/app/models/uds.model';
import { UdsService } from 'src/app/services/uds.service';
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
  beneficiarios: Beneficiario[];
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

  constructor(
    private beneficiarios$: BeneficiariosService,
    private uds$: UdsService
  ) {
    this.obtenerUds();
    this.obtenerBeneficiarios();
  }

  ngOnInit() {}

  obtenerBeneficiarios() {
    this.beneficiarios$.obtenerBeneficiarios().subscribe((resp: any) => {
      // console.log(resp);
      this.beneficiarios = resp.beneficiarios;
      this.beneficiarios.forEach((beneficiario: Beneficiario) => {
        this.contarIngresosPorMes(beneficiario);
        this.contarCupos(beneficiario);
        this.contarPoblacion(beneficiario);
      });

      // Deja valores nulos donde no hubo movimientos
      for (let i = 0; i < this.ingresosPorMes.length; i++) {
        if (this.ingresosPorMes[i] === 0 && this.egresosPorMes[i] === 0) {
          this.ingresosPorMes[i] = 0;
          this.egresosPorMes[i] = 0;
          this.meses[i] = '';
        }
      }
      this.mostrarGraficaLinea = true;
    });
  }

  obtenerUds() {
    this.uds$.obtenerUds().subscribe((resp: any) => {
      // console.log(resp);
      if (resp.ok) {
        // Guardo los beneficiarios vinculados y DS para mostrar en listado
        let beneficiariosAMostrar = [];
        // tomo cada unidad
        resp.uds.forEach((unidad: Uds) => {
          // tomo los beneficiarios de cada unidad y retiro los que no esten vinculados o con DS
          unidad.beneficiarios.forEach((beneficiario: Beneficiario) => {
            if (
              beneficiario.estado === 'Vinculado' ||
              beneficiario.estado === 'Dato sensible'
            ) {
              beneficiariosAMostrar.push(beneficiario);
            }
          });
          unidad.beneficiarios = beneficiariosAMostrar;
          beneficiariosAMostrar = [];
          // Luego cada UDS lo guardo en una variable para cada municipio
          if (unidad.ubicacion === 'Dagua') {
            this.udsDagua.push(unidad);
          } else {
            this.udsCali.push(unidad);
          }
        });
      } else {
        console.log(resp);
      }
    });
  }

  contarCupos(beneficiario: Beneficiario) {
    if (
      beneficiario.estado === 'Vinculado' &&
      beneficiario.uds.ubicacion === 'Dagua'
    ) {
      this.totalDaguaVinculados += 1;
    }
    if (
      beneficiario.estado === 'Vinculado' &&
      beneficiario.uds.ubicacion === 'Cali'
    ) {
      this.totalCaliVinculados += 1;
    }
    if (beneficiario.estado === 'Vinculado') {
      this.totalVinculados += 1;
    }
    if (
      beneficiario.estado === 'Dato sensible' &&
      beneficiario.uds.ubicacion === 'Cali'
    ) {
      this.totalCaliDS += 1;
    }
    if (
      beneficiario.estado === 'Dato sensible' &&
      beneficiario.uds.ubicacion === 'Dagua'
    ) {
      this.totalDaguaDS += 1;
    }
    if (beneficiario.estado === 'Dato sensible') {
      this.totalDatosSensibles += 1;
    }
  }

  contarPoblacion(beneficiario: Beneficiario) {
    // Si es extranjero y mayor de 10 años
    const nacimiento = moment(beneficiario.nacimiento, 'DD/MM/YYYY');
    const edadAnios = this.hoy.diff(nacimiento, 'years');
    if (
      (beneficiario.sexo === 'Hombre' &&
        edadAnios <= 5 &&
        beneficiario.estado === 'Vinculado') ||
      (beneficiario.sexo === 'Hombre' &&
        edadAnios <= 5 &&
        beneficiario.estado === 'Dato sensible')
    ) {
      this.totalHombres += 1;
      // console.log(beneficiario);
    }
    if (
      (beneficiario.sexo === 'Mujer' &&
        edadAnios <= 5 &&
        beneficiario.estado === 'Vinculado') ||
      (beneficiario.sexo === 'Mujer' &&
        edadAnios <= 5 &&
        beneficiario.estado === 'Dato sensible')
    ) {
      this.totalMujeres += 1;
      // console.log(beneficiario);
    }
    if (
      (edadAnios > 5 && beneficiario.estado === 'Vinculado') ||
      (edadAnios > 5 && beneficiario.estado === 'Dato sensible')
    ) {
      this.totalMG += 1;
      // console.log(beneficiario);
    }
    if (
      (beneficiario.tipoDoc === 'SD' && beneficiario.estado === 'Vinculado') ||
      (beneficiario.tipoDoc === 'SD' && beneficiario.estado === 'Dato sensible')
    ) {
      this.totalextranjeros += 1;
      // console.log(beneficiario);
    }
  }

  contarIngresosPorMes(beneficiario: Beneficiario) {
    const mesIngreso = moment(beneficiario.ingreso, 'DD/MM/YYYY').format('MMM');
    const mesEgreso = moment(beneficiario.egreso, 'DD/MM/YYYY').format('MMM');
    // Vinculados
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'feb.') {
      this.ingresosPorMes[0] += 1;
    }
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'mar.') {
      this.ingresosPorMes[1] += 1;
    }
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'abr.') {
      this.ingresosPorMes[2] += 1;
    }
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'may.') {
      this.ingresosPorMes[3] += 1;
    }
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'jun.') {
      this.ingresosPorMes[4] += 1;
    }
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'jul.') {
      this.ingresosPorMes[5] += 1;
    }
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'ago.') {
      this.ingresosPorMes[6] += 1;
    }
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'sep.') {
      this.ingresosPorMes[7] += 1;
    }
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'oct.') {
      this.ingresosPorMes[8] += 1;
    }
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'nov.') {
      this.ingresosPorMes[9] += 1;
    }
    if (beneficiario.estado === 'Vinculado' && mesIngreso === 'dic.') {
      this.ingresosPorMes[10] += 1;
    }
    // Desvinculados
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'feb.') {
      this.egresosPorMes[0] += 1;
    }
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'mar.') {
      this.egresosPorMes[1] += 1;
    }
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'abr.') {
      this.egresosPorMes[2] += 1;
    }
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'may.') {
      this.egresosPorMes[3] += 1;
    }
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'jun.') {
      this.egresosPorMes[4] += 1;
    }
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'jul.') {
      this.egresosPorMes[5] += 1;
    }
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'ago.') {
      this.egresosPorMes[6] += 1;
    }
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'sep.') {
      this.egresosPorMes[7] += 1;
    }
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'oct.') {
      this.egresosPorMes[8] += 1;
    }
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'nov.') {
      this.egresosPorMes[9] += 1;
    }
    if (beneficiario.estado === 'Desvinculado' && mesEgreso === 'dic.') {
      this.egresosPorMes[10] += 1;
    }
  }

  contarConDiscapacidad(beneficiario: Beneficiario) {
    if (beneficiario.discapacidad) {
      this.conDiscapacidad += 1;
    }
  }

  contarEnConcurrencia(beneficiario: Beneficiario) {
    if (beneficiario.estado === 'Concurrencia') {
      this.enConcurrencia += 1;
    }
  }

  contarMgAdolescente(beneficiario: Beneficiario) {
    // Si es extranjero y mayor de 10 años
    const nacimiento = moment(beneficiario.nacimiento, 'DD/MM/YYYY');
    const edadAnios = this.hoy.diff(nacimiento, 'years');
    if (edadAnios >= 10 && edadAnios <= 17) {
      this.mgAdolescente += 1;
    }
  }
}
