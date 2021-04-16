export const ChatConstants = {
    LIVE_CHAT: {
        ACTIONS: {
            LOGIN: 'login',
            START_CHAT: 'start_chat',
            ACTIVATE_CHAT: 'activate_chat',
            INCOMING_EVENT: 'incoming_event',
            SEND_EVENT: 'send_event',
            THREAD_CLOSED_EVENT: 'thread_closed',
            CLOSE_EVENT: 'close_thread',
            VALIDATION: 'validation',
            INCOMING_TYPING_EVENT: 'incoming_typing_indicator',
            INCOMING_MULTICAST: 'incoming_multicast',
            GET_PREDICTED_AGENT: 'get_predicted_agent',
            PING: 'ping'
        },
        MESSAGES: {
            ON_AGENT_CLOSE: 'El agente ha finalizado la conversación',
            ON_USER_CLOSE: 'El usuario ha cerrado el chat',
            ON_LOGIN: 'Se ha conectado un usuario derivado del chatbot',
            DEFAULT_ERROR: 'Lo sentimos, ha ocurrido un error de conexión.'
        },
        ERRORS: {
            authorization: `Lo siento, ha ocurrido un error de autorización, inténtalo de nuevo más tarde`,
            authentication: `Lo siento, ha ocurrido un error de autenticación, inténtalo de nuevo más tarde`,
            groups_offline: `En este momento nuestros operadores no están disponibles su horario es de lunes a viernes de 8 AM a 5 PM.`,
            group_offline: `En este momento nuestros operadores no están disponibles su horario es de lunes a viernes de 8 AM a 5 PM.`,
            users_limit_reached: `En este momento todos nuestros operadores están ocupados, intenta en unos minutos.`,
            group_unavailable: `No he podido encontrar un agente que pueda atenderte en este momento.`,
            group_not_found: `No he podido encontrar un agente que pueda atenderte en este momento.`,
            default: `Lo siento ha ocurrido un error y no podemos derivarte con nuestros operadores en este momento.`
        },
        TYPES: {
            LICENSE: 'license',
            MESSAGE: 'message',
            CLOSE: 'close'
        }
    },
    EVA: {
        BROKER_ERROR: 'Lo sentimos ha ocurrido un error',
        OBSERVER_ERROR: 'Ha ocurrido un error',
        MENSAJE_DESPEDIDA: 'Hasta luego.',
        HTTP_ERROR_RESPONSE: 'Ha ocurrido un error, por favor inténtalo de nuevo más tarde.'
    }
};
