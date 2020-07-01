export class Beneficiario {
  constructor(
    public tipoDoc: string,
    public documento: string,
    public nombre1: string,
    public nombre2: string,
    public apellido1: string,
    public apellido2: string,
    public sexo: string,
    public nacimiento: string,
    public paisNacimiento: string,
    public dptoNacimiento: string,
    public municipioNacimiento: string,
    public discapacidad: boolean,
    public direccion: string,
    public barrio: string,
    public telefono: string,
    public autorreconocimiento: string,
    public criterio: string,
    public infoCriterio: string,
    public ingreso: string,
    public tipoResponsable: string,
    public responsableId: any,
    public estado: string,
    public uds: any,
    public infoDiscapacidad?: string,
    public comentario?: string,
    public egreso?: string,
    public creadoEl?: string,
    public creadoPor?: any,
    // tslint:disable-next-line: variable-name
    public _id?: string
  ) {}
}
