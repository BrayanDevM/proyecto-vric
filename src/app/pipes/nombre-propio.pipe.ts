import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombrePropio'
})
export class NombrePropioPipe implements PipeTransform {
  transform(value: string, minusculas = true): string {
    return (minusculas
      ? value.toLowerCase()
      : value
    ).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
  }
}
