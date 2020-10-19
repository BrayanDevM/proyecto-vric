import { Pipe, PipeTransform } from '@angular/core';
declare var moment: any;

@Pipe({
  name: 'tiempoTranscurrido'
})
export class TiempoTranscurridoPipe implements PipeTransform {
  transform(value: string): string {
    return moment(value).fromNow();
  }
}
