import { LiveChatPayload } from './live-chat-payload.interface';

/**
 * Interfaz de las respuestas de los servicios de livechat.
 */
export interface LiveChatData {
    action: string;
    request_id: string;
    payload?: LiveChatPayload;
    type?: string;
    success?: boolean;
}
