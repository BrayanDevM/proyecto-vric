import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { BuscadorService } from 'src/app/services/buscador.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.css']
})
export class SearchToolbarComponent implements OnInit, AfterViewInit {
  @Output() cerrar: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('search') searchInput: ElementRef;

  myControl = new FormControl();
  busqueda: Resultados[] = [];

  resultados: Resultados[] = [];

  constructor(
    private buscador$: BuscadorService,
    private usuario$: UsuarioService,
    private router: Router
  ) {
    this.myControl.valueChanges
      .pipe(debounceTime(500), startWith(''))
      .subscribe(criterio => {
        if (criterio !== '') {
          this.filtrarBusqueda(criterio);
        }
      });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
  }

  filtrarBusqueda(criterio: string) {
    const filterValue = criterio.toLowerCase();
    let contador = 0;
    this.busqueda = [];
    this.resultados = [];

    this.buscador$
      .buscarEnColeccion('beneficiarios', filterValue)
      .subscribe((resp: any) => {
        console.log(resp);
        resp.beneficiarios.forEach((beneficiario: Beneficiario) => {
          if (beneficiario.uds !== null) {
            this.resultados.push({
              estado: beneficiario.estado,
              label: `${beneficiario.nombre1} ${beneficiario.nombre2} ${beneficiario.apellido1} ${beneficiario.apellido2}`,
              udsNombre: beneficiario.uds.nombre,
              udsId: beneficiario.uds._id
            });
          }
          contador++;
        });
        if (contador === resp.beneficiarios.length) {
          this.resultados.filter(
            resultado =>
              resultado.label.toLowerCase().indexOf(filterValue) === 0
          );
          this.busqueda = this.resultados;
          // console.log(this.resultados, 'Resultados');
        }
      });
  }

  verResultado(udsId: string) {
    if (this.usuario$.usuario.uds.includes(udsId)) {
      this.router.navigate(['/beneficiarios/uds', udsId]);
    } else {
      this.myControl.patchValue('');
    }
  }

  cerrarToolbar() {
    this.cerrar.emit(false);
  }
}

export interface Resultados {
  estado: string;
  label: string;
  udsNombre: string;
  udsId: string;
}
