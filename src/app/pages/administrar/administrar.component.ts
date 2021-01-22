import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { Reporte } from 'src/app/models/reportes.model';
import { CargarArchivosService } from 'src/app/services/cargar-archivos.service';
import { FileItem } from 'src/app/models/fileItem.model';
import Swal from 'sweetalert2';
import { PageLoadingService } from 'src/app/services/page-loading.service';
import { BeneficiariosService } from 'src/app/services/beneficiarios.service';
import { Config } from 'src/app/config/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { alertDanger } from 'src/app/helpers/swal2.config';
declare const moment: any;

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.component.html',
  styleUrls: ['./administrar.component.css']
})
export class AdministrarComponent implements OnInit {
  reportes: Reporte[] = [];
  cargando = false;
  // variables para importar beneficiarios
  archivo: FileItem;
  formData: FormData;
  archivoPlaceholder = 'Seleccionar archivo';
  tamanioArchivo = 0;
  estaSubiendo = false;
  haSubido = false;
  registrosAImportar = 0;
  registrosImportados = 0;
  beneficiariosExistentes = 0;
  responsablesExistentes = 0;

  // variables para la inactivación de beneficiarios
  formMasivo: FormGroup;
  estadosBeneficiarios = Config.SELECTS.estadosBeneficiarios;
  actualizandoMasivamente = false;
  minFechaIngreso = new Date(new Date().getFullYear() - 2, 0, 1); // 3 años atrás enero 1
  minNuevaFechaIngreso = new Date(new Date().getFullYear() - 2, 0, 1); // año actual enero 1
  maxFechaIngreso = new Date(moment()); // Hoy
  resultadoMasivo = [];

  @ViewChild('fileInput') fileInput;
  file: File | null = null;

  constructor(
    private pageLoading$: PageLoadingService,
    private reporte$: ReportesService,
    private cargarArchivo$: CargarArchivosService,
    private beneficiarios$: BeneficiariosService,
    private fb: FormBuilder
  ) {
    this.formMasivo = this.fb.group({
      campo: [null, Validators.required],
      filtro: [null, Validators.required],
      nuevoValor: [null, Validators.required]
    });
  }

  get fmv() {
    return this.formMasivo.value;
  }
  get fmc() {
    return this.formMasivo.controls;
  }

  ngOnInit() {
    this.obtenerReportes();
  }

  obtenerReportes() {
    this.cargando = true;
    this.reporte$.obtenerReportes().subscribe((resp: any) => {
      if (resp.ok) {
        // console.log(resp);
        this.reportes = resp.reportes;
        this.cargando = false;
        this.pageLoading$.loadingPages.emit(false);
      } else {
        this.cargando = false;
        this.pageLoading$.loadingPages.emit(false);
        console.log('error al traer reportes', resp.error);
      }
    });
  }

  actualizarReporte(reporte: Reporte) {
    this.reporte$.actualizarReporte(reporte).subscribe();
  }

  // validarArchivo(archivos: FileList) {}

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(archivos: FileList): void {
    this.formData = new FormData();
    this.archivo = new FileItem(archivos[0]);
    this.archivoPlaceholder = this.archivo.nombreArchivo;
    this.tamanioArchivo = this.archivo.data.size / 1024;
    this.formData.append('archivo', this.archivo.data);
    // const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    // this.file = files[0];
  }

  importarExcel() {
    Swal.fire({
      title: 'Importar beneficiarios',
      html: `Deseas importar el archivo <b>${this.archivoPlaceholder}</b>, el archivo debe estar correctamente diligenciado.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, importar'
    }).then((confirm: any) => {
      if (confirm.value) {
        this.estaSubiendo = true;
        this.cargarArchivo$
          .importarExcelBeneficiarios(this.formData)
          .subscribe((resp: any) => {
            this.estaSubiendo = false;
            this.haSubido = true;
            this.registrosAImportar = resp.registrosAImportar;
            this.registrosImportados = resp.registrosImportados;
            this.beneficiariosExistentes =
              resp.importado.beneficiariosExistentes;
            this.responsablesExistentes = resp.importado.responsablesExistentes;
          });
      }
    });
    this.estaSubiendo = false;
  }

  actualizacionMasiva() {
    if (this.formMasivo.invalid) {
      return;
    }

    let query: any;
    let nuevoValor: any;

    if (this.formMasivo.value.campo === 'estado') {
      query = `estado=${this.formMasivo.value.filtro}`;
      nuevoValor = { estado: this.formMasivo.value.nuevoValor };
    } else {
      query = `ingreso=${moment(this.formMasivo.value.filtro).format(
        'DD/MM/YYYY'
      )}`;
      nuevoValor = {
        ingreso: moment(this.formMasivo.value.nuevoValor).format('DD/MM/YYYY')
      };
    }

    alertDanger
      .fire({
        title: 'Actualización masiva',
        html: `¿Deseas actualizar todos los beneficiarios del sistema con el criterio elegido?`
      })
      .then((res) => {
        if (res.value) {
          this.resultadoMasivo = [];
          this.actualizandoMasivamente = true;
          this.beneficiarios$
            .actualizarBeneficiarios(query, nuevoValor)
            .subscribe((resp: any) => {
              this.actualizandoMasivamente = false;
              this.resultadoMasivo = [resp.response.n, resp.response.nModified]; // [registros que coinciden con criterio, registros modificados]
              console.log('query: ', query);
              console.log('nuevo valor: ', nuevoValor);
              console.log(resp);
            });
        }
      });
  }
}
