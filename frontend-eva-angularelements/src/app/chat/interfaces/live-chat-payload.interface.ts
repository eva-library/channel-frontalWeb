/**
 * Interfaz del payload de la respuesta de un servicio de livechat.
 */
export interface LiveChatPayload {
    timestamp?: number;
    url?: string;
    content?: Content;
    type?: string;
    chats?: any[];
    customer?: Customer;
    customer_side_storage?: CustomerSideStorage;
    chat?: any;
    customer_id?: string;
    event?: Event;
    chat_id?: string;
    thread_id?:string;
    routing_scope?: RoutingScope;
    token?: string;
    typing_indicator?: TypingIndicator;
    user_id?: string;
    error?: LiveChatError;
    avatar?: string;
    name?: string;
}

export interface LiveChatError {
    message: string;
    type: string;
}

export interface CustomerSideStorage {
    greetings_accepted_count: string;
    greetings_shown_count: string;
    last_visit_timestamp: string;
    name: string;
    page_views_count: string;
    visits_count: string;
}

export interface RoutingScope {
    type: string;
}

export interface Routing {
    continuous: Continuous;
}

export interface RoutingScope {
    type: string;
}

export interface Properties {
    routing: Routing;
    source: any;
}

export interface Continuous {
    value: boolean;
}

export interface Continuous {
    value: boolean;
}

export interface Greeting {
    agent: Agent;
    displayed_first_time: boolean;
    id: number;
    text: string;
    unique_id: string;
}

export interface Access {
    group_ids: number[];
}

export interface Agent {
    avatar: string;
    id: string;
    is_bot: boolean;
    job_title: string;
    name: string;
    present: boolean;
    type: string;
}

export interface Chat {
    access: Access;
    id: string;
    order: number;
    properties: any;
    thread: any;
    users: any;
}

export interface Content {
    greeting: Greeting;
    type: string;
}

export interface CustomerSideStorage {
    greetings_accepted_count: string;
    greetings_shown_count: string;
    last_visit_timestamp: string;
    name: string;
    page_views_count: string;
    visits_count: string;
}

export interface Event {
    author_id?: string;
    id?: string;
    order?: number;
    text?: string;
    timetamp?: number;
    type?: string;
}

export interface Customer {
    name?: string;
    email?: string;
    phoneNumber?: string;
    customer_token?: string;
}

export interface TypingIndicator {
    author_id: string;
    is_typing: boolean;
    timestamp: number;
}

export interface Source {
    client_id: any;
}
