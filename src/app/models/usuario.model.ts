export class Usuario {
  constructor(
    public nombre: string,
    public correo: string,
    public documento: string,
    public password: string,
    public telefono?: string,
    public rol?: string,
    public google?: boolean,
    public contratos?: any[],
    public uds?: any[],
    public activo?: boolean,
    public creadoEl?: string,
    // tslint:disable-next-line: variable-name
    public _id?: string
  ) {}
}
