/**
 * Interfaz del objeto de tipo Context en una respuesta de eva.
 */
export interface EvaContext {
    previous_node?: number;
    next_node?: string;
    nextIntent?: string;
    disableInput?: boolean;
    skipDialog?: boolean;
    customer_id?: string;
    customer_token?: string;
    attempt_in?: number;
    attempt_out?: number;
}
