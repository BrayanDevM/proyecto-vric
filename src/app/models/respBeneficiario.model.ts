export class RespBeneficiario {
  constructor(
    public tipoDoc: string,
    public documento: number,
    public nombre1: string,
    public nombre2: string,
    public apellido1: string,
    public apellido2: string,
    public sexo: string,
    public nacimiento: string,
    public paisNacimiento: string,
    public dptoNacimiento: string,
    public municipioNacimiento: string,
    public creadoEl?: string,
    public creadoPor?: any,
    // tslint:disable-next-line: variable-name
    public _id?: string
  ) {}
}
