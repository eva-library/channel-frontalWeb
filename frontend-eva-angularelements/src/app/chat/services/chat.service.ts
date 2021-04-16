import { Injectable, ElementRef } from '@angular/core';
import { HeaderService } from 'src/app/shared/services/header.service';
import { EvaService } from './eva.service';
import { Router } from '@angular/router';
import { ChatMessage, CHATTYPE } from '../models/chat-message.model';
import { evaConstants, timerConst } from 'src/environments/environment';
import { UIService } from 'src/app/shared/services/ui.service';
import { Customer } from '../models/customer.model';
import { LivechatService } from './livechat.service';
import { Observable } from 'rxjs';
import { ChatConstants } from '../chat-constants';
import { UtilsService } from '../../shared/services/utils.service';
//import { RemoteConfigService } from './remote-config.service';
import { LocalConfigService } from './local-config.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  /**
   * Variable que obtendra la configuración por país del BOT
   */
  evaConstsByCountry: any = evaConstants;
  /**
   * Arreglo de objetos de tipo ChatMessage que contiene todos los mensajes del chat.
   *
   */
  public chatMessages: ChatMessage[] = [];

  /**
   * Objeto que contiene la información del usuario.
   *
   */
  public customer: Customer;

  /**
   * Contenedor de los mensajes del chat.
   *
   */
  public messageContainer: ElementRef;
  /**
   * Caja de texto para enviar mensajes al chat.
   *
   */
  public inputBox: ElementRef;

  /**
   * Temporizador; al llegar a cero cambia el estado del bot a durmiendo.
   *
   */
  idle: any;

  /**
   * Temporizador; al llegar a cero finaliza la conversación por inactividad del usuario.
   *
   */
  end: any;

  /**
   * Observable para livechat que devuelve los mensajes del livechatService
   *
   */
  liveChatObservable: Observable<ChatMessage>;

  /**
   * Bandera que indica si el usuario está o no derivado con un agente real.
   *
   */
  derive = false;

  /**
   * Variable que indica si el usuario ha hablado con un agente.
   *
   */
  talkedWithAgent = false;

  //Objeto que mantiene la lista de materiales seleccionados desde el carousel con el objetivo de "recordar" cantidades ingresadas a lo largo del flujo conversacional
  objListaMaterialesSeleccionados = {};

  constructor(
    private router: Router,
    public headerService: HeaderService,
    public evaService: EvaService,
    public uiService: UIService,
    public utilsService: UtilsService,
    public livechatService: LivechatService,
    //private remoteConfigService: RemoteConfigService,
    private localConfigService: LocalConfigService
  ) {
    //seleccionamos la configuración de eVA de acuerdo al país almacenado
    //this.evaConstsByCountry = remoteConfigService.config.headers;
  }

  

  /**
   * Método que inicializa las varibles del chat así como los datos necesarios para evaService.
   *
   */
  initialize() {
    console.log('headers', this.localConfigService.config.headers);
    this.evaConstsByCountry.HEADERS = this.localConfigService.config.headers;
    this.chatMessages = [];
    this.evaService.chatMessages = [];
    this.evaService.sessionCode = null;
    this.evaService.currentIntent = '';
    this.evaService.customer = this.customer;
    this.uiService.disableInput = false;
    this.uiService.conected = true;
    this.headerService.setBot();
  }

  /**
   * Establece como contenedor de mensajes el objeto que se le pasa como parámetro.
   *
   */
  setMessageContainer(messageContainer: ElementRef) {
    this.messageContainer = messageContainer;
  }

  /**
   * Establece como caja de entrada de texto el objeto que se le pasa como parámetro.
   *
   */
  setInputBox(inputBox: ElementRef) {
    this.inputBox = inputBox;
  }

  /**
   * Establece si se debe chatear a través de eva o a través de livechat.
   *
   */
  conversation(text: string, code: string, context: any) {
    if (!this.derive) {
      console.log('Chatting ewith eva');
      this.conversationWithEva(text, code, context);
    } else {
      this.livechatService.apiSendChatMessage(text);
    }
  }

  /**
   * Establece la lógica de cierre del chat.
   *
   */
  endConversation() {

    if (!this.derive) {
      this.endConversationWithEva();
    } else {
      this.endConversationWithLivechat();
    }
  }

  /**
   * Método que se suscribe a un observable de evaService para realizar una consulta.
   *
   * @param text texto que ingresa el usuario en el input box.
   * @param code código del controlador de eva.
   * @param context json con propiedades como name, nextIntent, prevIntent, entre otras.
   */
  conversationWithEva(text: string, code: string, context: any) {
    const self = this;
    this.uiService.writing = true;
    this.uiService.disableInput = true;

    this.evaService.conversationManaged(text, code, context)
      .subscribe({
        next(message) {
          console.log('new message', message);
          self.chatMessages.push(message);

          if (message.shouldEnd) {
            self.uiService.writing = false;
            self.uiService.disableInput = true;
            self.endChat();
          }
          if (message.context) {
            self.contextBehavior(message);
          }
          
          self.uiService.scrollToBottom(self.messageContainer);
        },
        error(error) {
          console.error(error);
          self.chatMessages.push(error);
          self.uiService.writing = false;
          self.uiService.disableInput = true;
          // self.uiService.conected = false;
          self.uiService.scrollToBottom(self.messageContainer);
        },
        complete() {
          setTimeout(() => {
            self.uiService.writing = false;
            if (self.evaService.chatMessages[self.evaService.chatMessages.length - 1].options) {
              self.uiService.disableInput = true;
            } else {
              self.uiService.disableInput = false;
            }
          }, 150);
          setTimeout(() => {
            if(self.inputBox){
              self.inputBox.nativeElement.focus();
            }
            self.uiService.scrollToBottom(self.messageContainer);
            self.utilsService.playAudio();
          }, 150);
        }
      });
  }

  /**
   * Método que finaliza el chat.
   *
   */
  endChat() {
    // setTimeout(() => {
      let params :any = {};
      params.code = this.utilsService.getParamValueQueryString('code');
      this.router.navigate(['/feedbackForm'], {queryParams : params});
      console.log('Chat ended!');
    // }, 3000);
  }

  /**
   * Método que inicia un temporizador que al finalizar activa el estadode dormir del avatar.
   *
   */
  idleTimeOut() {
    if (this.idle) {
      clearTimeout(this.idle);
      this.idle = null;
    }
    // console.log('%c ⏳Idle ', 'color: white; background-color: #2274a5', 'Started', this.idle);
    this.idle = setTimeout(() => {
      console.log('%c ⌛️Idle ', 'color: white; background-color: #2274a5', 'Ended', this.idle);
      this.headerService.sleepAvatar(true);
    }, timerConst.SLEEP);
  }

  /**
   * Método que inicia un temporizador que al finalizar termina el chat por inactividad.
   *
   */
  endTimeOut() {
    if (this.end) {
      clearTimeout(this.end);
      this.end = null;
    }
    // console.log('%c ⏳End ', 'color: white; background-color: #d33f49', 'Started', this.end);
    this.end = setTimeout(() => {
      console.log('%c ⌛️End ', 'color: white; background-color: #d33f49', 'Ended', this.end);
      this.endChat();
      // if (!this.derive) {
      //   console.log('%c ⌛️End ', 'color: white; background-color: #d33f49', 'Ended properly', this.end);
      // }
    }, timerConst.END);
  }

  /**
   * Métofo que despierta el avatar ante un evento del usuario.
   *
   * @param [button] Si el evento es el click de un botón debe enviarse un true como parámetro.
   */
  awakeAvatar() {
    this.headerService.sleepAvatar(false);
    this.idleTimeOut();
    this.endTimeOut();
  }

  /**
   * Método que llama a otros métodos dependiendo de los valores que contenga el contexto del mensaje dado com parámetro.
   *
   * @param message mensaje con contexto.
   */
  contextBehavior(message: ChatMessage) {
    if (message.context.customer_token) {
      this.startLiveChat(message);
    }
  }

  /**
   * Método que deriva la conversación a un agente de liveChat.
   *
   * @param message mensaje que contiene un contexto con derivación.
   */
  startLiveChat(message: ChatMessage) {    
    this.customer.customerToken = `Bearer ${message.context.customer_token}`;
    this.derive = true;
    this.livechatService.customer = this.customer;
    this.liveChatObservable = this.livechatService.conversationManaged();
    this.livechatService.convHistory = this.historyMessages();
    if (this.idle) {
      clearTimeout(this.idle);
      this.idle = null;
      console.log('%c ⌛️Idle ', 'color: white; background-color: #d33f49', 'Ended properly', this.idle);
    }
    if (this.end) {
      clearTimeout(this.end);
      this.end = null;
      console.log('%c ⌛️End ', 'color: white; background-color: #d33f49', 'Ended properly', this.end);
    }
    this.liveChatObservable.subscribe(
      (liveChatMessage) => {
        this.chatMessages.push(liveChatMessage);
        this.uiService.scrollToBottom(this.messageContainer);
        if (liveChatMessage.shouldEnd === true) {
          this.talkedWithAgent = true;
        }
      },
      (err) => {
        console.error(err);
      },
      () => {
        console.log('Complete');
        this.derive = false;
        if (this.talkedWithAgent) {
          this.uiService.conected = false;
          this.endChat();
        }
      }
    );
  }

  /**
   * Termina la conversación si se está chateando con eVA.
   *
   */
  private endConversationWithEva() {
    console.log('endConversationWithEva');
    // const chatMessage = new ChatMessage(1, false, ChatConstants.EVA.MENSAJE_DESPEDIDA, this.utilsService.setMessageTime());
    const chatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                        .withMessage( ChatConstants.EVA.MENSAJE_DESPEDIDA)
                                        .build();
    this.chatMessages.push(chatMessage);
    this.conversationWithEva(chatMessage.message, '', null);
  }

  /**
   * Termina la conversación cuando se está chateeando con un agente de liveChat.
   *
   */
  private endConversationWithLivechat() {
    console.log('endConversationWithLivechat');
    this.livechatService.livechatClose();
    this.talkedWithAgent = true;
    this.uiService.conected = false;
    this.endConversationWithEva();
  }

  /**
   * Envía el historico del chat.
   *
   * @returns Retorna un arreglo con los últimos 15 mensajes o menos del histórico del chat.
   */
  private historyMessages() {
    let history: ChatMessage[];
    const size = this.chatMessages.length;
    if (size <= 15) {
      history = this.chatMessages;
    } else {
      history = this.chatMessages.slice(size - 15, size - 1);
    }
    return history;
  }
}
