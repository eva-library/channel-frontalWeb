import { EvaContext } from './eva-response-context.interface';
import { EvaAnswer } from './eva-response-answer.interface';

/**
 * Interfaz de la respuesta que se recibe de eva.
 */
export interface EvaResponse {
    answers: EvaAnswer[];
    text: string;//eva 3
    sessionCode: string; //eva 3
    intent: string; //eva 3
    confidence: string; //eva 3
    context: EvaContext; //eva 3
}
