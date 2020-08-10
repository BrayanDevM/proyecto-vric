import { NgModule } from '@angular/core';
import { DocumentoPipe } from './documento.pipe';
import { PrimeraLetraPipe } from './primera-letra.pipe';
import { NombrePropioPipe } from './nombre-propio.pipe';

const pipes = [PrimeraLetraPipe, DocumentoPipe, NombrePropioPipe];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
  imports: []
})
export class AppPipesModule {}
