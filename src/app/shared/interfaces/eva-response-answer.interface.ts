import { EvaOption } from './eva-options.interface';
import { QuickReply } from './eva-quickreply.interface';

/**
 * Interfaz del objeto Answer en la respuesta de eva.
 */
export interface EvaAnswer {
    code: string;
    title: string;
    text: string;
    buttons: EvaOption[];
    confidence: number;
    technicalText: string;
    options: EvaOption[];

    content: any;//eva 3 puede ser texto o un arreglo
    type: string; //eva 3
    quickReply: QuickReply[]; //eva 3
    id: string; //eva 3
    description: string; //eva 3
    interactionId: string; //eva 3
    name: string //eva 3
}
