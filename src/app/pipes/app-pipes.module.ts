import { NgModule } from '@angular/core';
import { DocumentoPipe } from './documento.pipe';
import { PrimeraLetraPipe } from './primera-letra.pipe';
import { NombrePropioPipe } from './nombre-propio.pipe';
import { TiempoTranscurridoPipe } from './tiempo-transcurrido.pipe';

const pipes = [
  PrimeraLetraPipe,
  DocumentoPipe,
  NombrePropioPipe,
  TiempoTranscurridoPipe
];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
  imports: []
})
export class AppPipesModule {}
