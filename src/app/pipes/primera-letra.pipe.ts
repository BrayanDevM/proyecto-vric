import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primeraLetra'
})
export class PrimeraLetraPipe implements PipeTransform {
  transform(value: string): string {
    return value.charAt(0).toUpperCase();
  }
}
