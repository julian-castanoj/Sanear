export interface Sheet {
    encargado: string;
    transporte: string;
    fecha: Date;
    personal: Array<string>;
    entrada: CharacterData;
    salida: CharacterData;
    observacion: string;
}