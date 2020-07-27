export class Uds {
  constructor(
    public codigo: number,
    public cupos: number,
    public nombre: string,
    public ubicacion: string,
    public arriendo: boolean,
    public creadoPor: any,
    public beneficiarios?: any[],
    public creadoEl?: string,
    public docentes?: any[],
    public coordinador?: any,
    public gestor?: any,
    public activa?: boolean,
    public enContrato?: any,
    // tslint:disable-next-line: variable-name
    public _id?: string
  ) {}
}
