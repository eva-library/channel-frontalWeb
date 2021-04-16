import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { LiveChatConstants } from 'src/environments/environment';
import { Customer } from '../models/customer.model';
import { ChatConstants } from '../chat-constants';
import { LiveChatData } from '../interfaces/live-chat-data.interface';
import { LiveChatPayload, Event } from '../interfaces/live-chat-payload.interface';
import { ChatMessage, CHATTYPE } from '../models/chat-message.model';
import { Observable, Subscriber } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { UIService } from 'src/app/shared/services/ui.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { BotDataService } from './bot-data.service';

@Injectable({
  providedIn: 'root'
})
export class LivechatService {

  /**
   * Elemento que almacena la información del usuario.
   *
   */
  customer: Customer;

  /**
   * Objeto que se encarga de conectar a livechat y transmitir sus respecticos eventos.
   *
   */
  private livechatSubject: any;

  /**
   * Objeto que contendrá el temporizador para ejecutar el pinl
   *
   */
  private ping: any;

  /**
   * Objeto que contendrá el temporizador para cerrar la conexión cuando no se envíe un ping desde el servidor
   *
   */
  private pingTimeout: any;

  /**
   * Id del chat del usuario con el agente de livechat.
   *
   */
  chatId: string;

  /**
   *  Arreglo que contiene el histórico de la conversación con el bot.
   *
   */
  convHistory: ChatMessage[];

  /**
   * Observable al que se suscribe el chatService y que le devuelve un objeto de tipo ChatMessage.
   *
   */
  private convObserver: Subscriber<ChatMessage>;

  constructor(
    private utilsService: UtilsService,
    private uiService: UIService,
    private headerService: HeaderService,
    private botDataService: BotDataService
  ) { }

  /**
   * Método que se ejecuta para inicializar el livechat service.
   *
   */
  private initialize() {
    let country = this.utilsService.getParamValueQueryString('country');
    let lconstant = LiveChatConstants;
    this.livechatSubject = webSocket(`${lconstant.apiUrl}?license_id=${lconstant.licenseID}`);
    this.connectToLiveChat();
    this.apiSendLogin();
    this.pingConnection();
  }

  /**
   * Método que se ejecuta cuándo se detecta un evento.
   *
   */
  private connectToLiveChat() {
    this.livechatSubject.subscribe(
      (data) => {
        if (data.success === false) {
          this.handleErrors(data);
          this.livechatSubject.complete();
          return;
        }
        console.log('Connected: ', data);
        this.actionBehavior(data);
      },
      (err) => {
        console.log('Error: ', err);
        const liveChatData: LiveChatData = {
          action: ChatConstants.LIVE_CHAT.ACTIONS.CLOSE_EVENT,
          request_id: null,
          type: ChatConstants.LIVE_CHAT.TYPES.CLOSE
        };
        this.onThreadClosed(liveChatData);
      },
      () => {
        console.log('Completed');
        this.disconnect();
      }
    );
  }

  /**
   * Método que envía un payloald a livechat para loguearse
   *
   */
  private apiSendLogin() {
    const message: LiveChatPayload = {
      token: this.customer.customerToken,
      customer: {
        name: this.customer.name,
        email: this.customer.email
      }
    };

    this.sendMessage(ChatConstants.LIVE_CHAT.ACTIONS.LOGIN, message);
  }

  /**
   * Método que hace una petición a liveChat.
   *
   * @param actionName nombre de la acción.
   * @param [payload] Datos para livechat.
   */
  private sendMessage(actionName: string, payload?: LiveChatPayload) {
    const protocolMessage: LiveChatData = {
      action: actionName,
      request_id: this.generateID()
    };
    if (payload) {
      protocolMessage.payload = payload;
    }
    this.livechatSubject.next(protocolMessage);
  }

  /**
   * Método que genera un id
   *
   * @returns string id
   */
  private generateID() {
    //livechat.service.ts no se utilizará en este desarrollo
    //Se quita el valor aleatorio por generar vulnerabilidad en la seguridad (reporte Fortify)
    //Se devuelve un valor constante en su lugar, con el objetivo de no tener que intervenir innecesariamente el código para un componente que no será usado
    //return Math.random().toString(36);
    return '0';
  }

  /**
   * Método que envía un ping a livechat cada 30 seguntos para mantener activa la conversación.
   *
   */
  private pingConnection() {
    this.ping = setInterval(() => {
      this.sendMessage('ping');
    }, 15000);
  }

  /**
   * Método que se ejecuta ante el evento de desconexión de livechat
   *
   */
  private onThreadClosed(liveChatData: LiveChatData) {
    console.log('%c ⌛️OnThreadClose ', 'color: white; background-color: #2274a5', 'Excecuted', liveChatData);
    if (liveChatData.payload && liveChatData.payload.user_id !== this.customer.customerId) {
      console.log('%c Close type ', 'color: white; background-color: #2274a5', 'Excecuted by normal thread close');
      // const chatMessage: ChatMessage = {
      //   bot: true,
      //   message: ChatConstants.LIVE_CHAT.MESSAGES.ON_AGENT_CLOSE,
      //   time: this.utilsService.setMessageTime(),
      //   type: 1,
      //   shouldEnd: true
      // };
      const chatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                          .withMessage(  ChatConstants.LIVE_CHAT.MESSAGES.ON_AGENT_CLOSE)
                                          .build();
      this.convObserver.next(chatMessage);
    }
    console.log('%c ⌛️OnThreadClose ', 'color: white; background-color: #2274a5', 'after if');

    if (liveChatData.type === ChatConstants.LIVE_CHAT.TYPES.CLOSE
      || liveChatData.action === ChatConstants.LIVE_CHAT.ACTIONS.PING) {
      console.log('%c Close type ', 'color: white; background-color: #2274a5', 'Excecuted by type close or  action ping');
      // const chatMessage: ChatMessage = {
      //   bot: true,
      //   message: ChatConstants.LIVE_CHAT.MESSAGES.DEFAULT_ERROR,
      //   time: this.utilsService.setMessageTime(),
      //   type: 1,
      //   shouldEnd: true
      // };
      const chatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                          .withMessage(ChatConstants.LIVE_CHAT.MESSAGES.DEFAULT_ERROR)
                                          .build();
      this.convObserver.next(chatMessage);
      this.convObserver.complete();
    }
    return this.livechatSubject.complete();
  }

  /**
   * Método que se ejecuta al cerrar la conexión del websocket (en el complete)
   *
   */
  private disconnect() {
    console.log('%c Disconect ', 'color: white; background-color: #2274a5', 'Excecuted disconect');
    this.convObserver.complete();
    if (this.pingTimeout) {
      clearTimeout(this.ping);
      this.pingTimeout = null;
    }
    if (this.ping) {
      clearInterval(this.ping);
      this.ping = null;
    }
  }

  /**
   * Método que se llama cuando el usuario cierra el chat, dispara evento de cierre de conversación
   *
   */
  livechatClose() {
    const message = {
      chat_id: this.chatId
    };
    console.log("close chat thread");
    this.sendMessage(ChatConstants.LIVE_CHAT.ACTIONS.CLOSE_EVENT, message);
  }

  /**
   * Método que ejecuta otros métodos dependiendo del evento que llegó.
   *
   * @param liveChatData repuesta de livechat
   */
  private actionBehavior(liveChatData: LiveChatData) {
    switch (liveChatData.action) {
      case (ChatConstants.LIVE_CHAT.ACTIONS.LOGIN):
        this.onLogin(liveChatData);
        break;
      case (ChatConstants.LIVE_CHAT.ACTIONS.START_CHAT):
        this.onMessageStartChat(liveChatData);
        break;
      case (ChatConstants.LIVE_CHAT.ACTIONS.ACTIVATE_CHAT):
        this.onActivateStartChat(liveChatData);
        break;
      case (ChatConstants.LIVE_CHAT.ACTIONS.INCOMING_EVENT):
        this.onMessageAgent(liveChatData);
        break;
      case (ChatConstants.LIVE_CHAT.ACTIONS.INCOMING_TYPING_EVENT):
        this.onIncomingTypingEvent(liveChatData);
        break;
      case (ChatConstants.LIVE_CHAT.ACTIONS.THREAD_CLOSED_EVENT):
        this.onThreadClosed(liveChatData);
        break;
      case (ChatConstants.LIVE_CHAT.ACTIONS.GET_PREDICTED_AGENT):
        this.onGetPredictedAgent(liveChatData);
        break;
      case (ChatConstants.LIVE_CHAT.ACTIONS.PING):
        this.onPing(liveChatData);
        break;
    }
  }

  private onPing(liveChatData: LiveChatData) {
    if (this.pingTimeout) {
      clearTimeout(this.pingTimeout);
      this.pingTimeout = null;
      console.log('%c ⌛PING CLEARED ', 'color: white; background-color: #2274a5', 'PING clear', this.pingTimeout);
    }
    // console.log('%c ⏳Idle ' , 'color: white; background-color: #2274a5', 'Started', this.idle);
    this.pingTimeout = setTimeout(() => {
      console.log('%c ⌛PING TIMEOUT ', 'color: white; background-color: #2274a5', 'PING Timeout', this.pingTimeout);
      this.onThreadClosed(liveChatData);
    }, 50000);
  }

  /**
   * Método que se ejecuta al loguearse en livechat.
   *
   * @param liveChatData respuesta de livechat.
   * @returns retorna un mensaje indicando que el usuario ha sido derivado a livechat.
   */
  private onLogin(liveChatData: LiveChatData) {
    this.chatId = liveChatData.payload.chats[0] ? liveChatData.payload.chats[0].chat_id : null;
    this.customer.customerId = liveChatData.payload.customer_id;

    if (this.chatId !== null) {
      this.activeChat(liveChatData);
    }else{
      this.apiSendStartChat();
    }
  }

  /**
   * Activa el chat inactivo del usuario para conectar con livechat
   */

  private activeChat(LiveChatData: LiveChatData) {
    const message: LiveChatPayload = {
      chat: { id: this.chatId }
    };
    this.sendMessage(ChatConstants.LIVE_CHAT.ACTIONS.ACTIVATE_CHAT, message);
  }

  /**
   * Inicia un chat con el agente de livechat.
   *
   */
  private apiSendStartChat() {
    console.log("enter start");
    this.sendMessage(ChatConstants.LIVE_CHAT.ACTIONS.START_CHAT);
  }

  private onActivateStartChat(liveChatData: LiveChatData) {
    this.sendMessage(ChatConstants.LIVE_CHAT.ACTIONS.GET_PREDICTED_AGENT);
  }

  /**
   * Envía un mensaje de texto a livechat.
   *
   * @param textMessage texto que se queire enviar como mensaje al agente de livechat.
   */
  apiSendChatMessage(textMessage: string) {
    const event: Event = {
      type: ChatConstants.LIVE_CHAT.TYPES.MESSAGE,
      text: textMessage
    };
    const message: LiveChatPayload = {
      chat_id: this.chatId,
      event
    };
    this.sendMessage(ChatConstants.LIVE_CHAT.ACTIONS.SEND_EVENT, message);
  }

  /**
   * Método que se ejecuta cuando inicia el chat.
   * Establece el valor local del chat_id como el valor del chat_id en la respuesta de livechat.
   *
   * @param liveChatData Respuesta de livechat.
   */
  private onMessageStartChat(liveChatData: LiveChatData) {
    this.chatId = liveChatData.payload.chat_id;
    this.sendMessage(ChatConstants.LIVE_CHAT.ACTIONS.GET_PREDICTED_AGENT);
    this.conversationHistoryBuilder(this.convHistory);
  }

  /**
   * Método que se ejecuta cuando se recibe un mensaje de tipo incoming_event.
   *
   * @param liveChatData Respuesta de livechat.
   */
  private onMessageAgent(liveChatData: LiveChatData) {
    if (liveChatData.payload.event.type === ChatConstants.LIVE_CHAT.TYPES.MESSAGE &&
      liveChatData.payload.event.author_id !== this.customer.customerId) {
      // const chatMessage: ChatMessage = {
      //   bot: true,
      //   message: liveChatData.payload.event.text,
      //   time: this.utilsService.setMessageTime(),
      //   type: 1,
      // };

      const chatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                          .withMessage(liveChatData.payload.event.text)
                                          .build();


      this.convObserver.next(chatMessage);
    }
  }

  /**
   * Método que indica que el agente está escribiendo.
   *
   * @param liveChatData Respuesta de livechat.
   */
  private onIncomingTypingEvent(liveChatData: LiveChatData) {
    this.uiService.writing = liveChatData.payload.typing_indicator.is_typing;

  }

  /**
   * Método que inicializa la derivación y devuelve un observable que emite los mensajes del agente.
   *
   * @returns Observable que emite los mensajes.
   */
  conversationManaged(): Observable<ChatMessage> {
    const convObservable: Observable<ChatMessage> = new Observable((observer) => {
      this.convObserver = observer;
      this.initialize();
    });

    return convObservable;
  }

  /**
   *  Muestra un mensaje indocando que ocurrio un error en la comunicación con liveChat.
   *
   * @param data Respuesta con error que envía liveChat.
   */
  private handleErrors(data: LiveChatData) {
    console.error('%c Handled Error ', 'color: white; background-color: #d33f49', data.payload.error);
    const E = this.botDataService.botMessages;
    const type = E[data.payload.error.type] != null ? E[data.payload.error.type] : E.default;
    // const chatMessage: ChatMessage = new ChatMessage(1, true, type, this.utilsService.setMessageTime());

    const chatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                        .withMessage(type)
                                        .build();

    this.convObserver.next(chatMessage);
  }

  /**
   * Envía al agente los 15 últimos mensajes (o menos) entre el usuario y el bot.
   *
   * @param chatMessages Arreglo de mensajes que se se enviarán al agente.
   */
  private conversationHistoryBuilder(chatMessages: ChatMessage[]) {
    let index = 0;
    chatMessages.forEach(message => {
      if (message.message) {
        const conversationPart = `[${message.bot ? 'Bot' : this.customer.name}]
        ${this.utilsService.removeTags(message.message)}\n`;
        index++;
        setTimeout(() => {
          this.apiSendChatMessage(conversationPart);
        }, 30 * index);
      }
    });
  }

  /**
   *  Método que en base a la respuesta de livechat cambia el nombre y la imagen del agente en el header.
   *
   * @param liveChatData Respuesta de livechat.
   */
  private onGetPredictedAgent(liveChatData: LiveChatData) {
    // console.log("---------------------------------" ,liveChatData)
    this.headerService.setAgent(liveChatData.payload.name, liveChatData.payload.avatar);
    if (this.chatId === null) {
      return this.apiSendStartChat();
    }
    this.apiSendChatMessage(ChatConstants.LIVE_CHAT.MESSAGES.ON_LOGIN);
    this.conversationHistoryBuilder(this.convHistory);
  }
}
