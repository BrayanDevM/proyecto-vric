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
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Beneficiario } from 'src/app/models/beneficiario.model';
import { BuscadorService } from 'src/app/services/buscador.service';

@Component({
  selector: 'app-search-toolbar',
  templateUrl: './search-toolbar.component.html',
  styleUrls: ['./search-toolbar.component.css']
})
export class SearchToolbarComponent implements OnInit, AfterViewInit {
  @Output() cerrar: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('search') searchInput: ElementRef;

  myControl = new FormControl();
  busqueda: Observable<any[]>;

  resultados: Resultados[] = [];

  constructor(private buscador$: BuscadorService) {
    this.busqueda = this.myControl.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      map(criterio =>
        criterio ? this._filterStates(criterio) : this.resultados.slice()
      )
    );
  }

  ngOnInit(): void {}

  private _filterStates(criterio: string) {
    this.buscarTodos(criterio);

    const filterValue = criterio.toLowerCase();

    return this.resultados.filter(
      resultado => resultado.label.toLowerCase().indexOf(filterValue) === 0
    );
  }
  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
  }

  buscarTodos(criterio: string) {
    this.buscador$.buscarTodos(criterio).subscribe((resp: any) => {
      console.log(resp);
      resp.beneficiarios.forEach((beneficiario: Beneficiario) => {
        this.resultados.push({
          tipo: 'Beneficiario',
          label: `${beneficiario.nombre1} ${beneficiario.nombre2} ${beneficiario.apellido1} ${beneficiario.apellido2}`,
          descripcion: beneficiario.uds.nombre || '',
          enlace: `/beneficiarios/uds/${beneficiario.uds._id}`
        });
      });
    });
  }

  cerrarToolbar() {
    this.cerrar.emit(false);
  }
}

export interface Resultados {
  tipo: string;
  label: string;
  descripcion: string;
  enlace: string;
}
