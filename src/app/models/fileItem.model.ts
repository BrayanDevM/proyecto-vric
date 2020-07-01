export class FileItem {
  public data: File;
  public nombreArchivo: string;
  public url: string;
  public estaSubiendo: boolean;

  constructor(archivo: File) {
    this.data = archivo;
    this.nombreArchivo = archivo.name;
    this.estaSubiendo = false;
  }
}
