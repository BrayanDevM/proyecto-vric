import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documento'
})
export class DocumentoPipe implements PipeTransform {
  transform(documento: any): any {
    if (documento === null || documento === undefined) {
      return;
    }

    const esExtranjero = this.comprobarDocumentoExtranjero(documento);
    if (esExtranjero) {
      return documento;
    } else {
      documento = this.formatearDocumento(documento, '');
      return documento;
    }
  }

  comprobarDocumentoExtranjero(valor: string) {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    valor = valor.toUpperCase();
    for (let i = 0; i < valor.length; i++) {
      if (letras.indexOf(valor.charAt(i), 0) !== -1) {
        // Si tiene letras lo devuelvo como está
        return true;
      }
    }
    return false;
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
