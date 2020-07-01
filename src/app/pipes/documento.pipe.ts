import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documento'
})
export class DocumentoPipe implements PipeTransform {
  transform(documento: any): any {
    if (documento === null || documento === undefined) {
      return;
    }
    documento = this.formatearDocumento(documento, '');
    return documento;
  }

  formatearDocumento(numero: any, prefijo: string) {
    const separadorMiles = '.';
    const separadorDecimales = ',';
    const regex = new RegExp('[^' + separadorDecimales + '\\d]', 'g');
    const numeroString = numero.replace(regex, '').toString();
    const split = numeroString.split(separadorDecimales);
    const rest = split[0].length % 3;
    let resultado = split[0].substr(0, rest);
    const miles = split[0].substr(rest).match(/\d{3}/g);

    if (miles) {
      const separator = rest ? separadorMiles : '';
      resultado += separator + miles.join(separadorMiles);
    }
    resultado =
      split[1] !== undefined
        ? resultado + separadorDecimales + split[1]
        : resultado;
    return prefijo === undefined
      ? resultado
      : resultado
      ? prefijo + resultado
      : '';
  }
}
