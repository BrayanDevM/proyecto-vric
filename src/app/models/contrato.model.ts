export class Contrato {
  constructor(
    public codigo: number,
    public cupos: number,
    public eas: string,
    public nit: string,
    public regional: string,
    public cz: string,
    public creadoPor: string,
    public creadoEl?: string,
    public activo?: boolean,
    public uds?: any[],
    // tslint:disable-next-line: variable-name
    public _id?: string
  ) {}
}
