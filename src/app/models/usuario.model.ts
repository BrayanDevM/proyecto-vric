export class Usuario {
  constructor(
    public nombre: string,
    public correo: string,
    public documento: number,
    public password: string,
    public telefono?: string,
    public rol?: string,
    public google?: boolean,
    public contratos?: [],
    public uds?: [],
    public activo?: boolean,
    public creadoEl?: string,
    // tslint:disable-next-line: variable-name
    public _id?: string
  ) {}
}
