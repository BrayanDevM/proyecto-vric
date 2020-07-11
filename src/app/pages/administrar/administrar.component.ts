import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { Reporte } from 'src/app/models/reportes.model';
import { CargarArchivosService } from 'src/app/services/cargar-archivos.service';
import { FileItem } from 'src/app/models/fileItem.model';
import Swal from 'sweetalert2';

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

  constructor(
    private reporte$: ReportesService,
    private cargarArchivo$: CargarArchivosService
  ) {}

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
      } else {
        this.cargando = false;
        console.log('error al traer reportes', resp.error);
      }
    });
  }

  actualizarReporte(reporte: Reporte) {
    this.reporte$.actualizarReporte(reporte).subscribe();
  }

  validarArchivo(archivos: FileList) {
    this.formData = new FormData();
    this.archivo = new FileItem(archivos[0]);
    this.archivoPlaceholder = this.archivo.nombreArchivo;
    this.tamanioArchivo = this.archivo.data.size / 1024;
    this.formData.append('archivo', this.archivo.data);
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
}
