export class Reporte {
  constructor(
    public tipo: string,
    public descripcion: string,
    public creadoEl: string,
    public completado?: boolean,
    public reportadoPor?: any,
    // tslint:disable-next-line: variable-name
    public _id?: string
  ) {}
}
