/**
 * Interfaz del cuerpo para una petición a eva.
 */
export interface EvaRequestBody {
    text: string;
    code: string;
    context?: any;
}
