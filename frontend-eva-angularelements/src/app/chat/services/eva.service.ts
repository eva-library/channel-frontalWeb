import { EvaResponse } from '../../shared/interfaces/eva-response.interface';
import { HttpOptions } from '../../shared/interfaces/http-options.interface';
import { RestService } from '../../shared/services/rest.service';
import { Injectable } from '@angular/core';
import { evaConstants } from '../../../environments/environment';
import { ChatMessage, CHATTYPE } from '../models/chat-message.model';
import { Customer } from 'src/app/chat/models/customer.model';
import { Observable, Subscriber } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ChatConstants } from 'src/app/chat/chat-constants';
//import { RemoteConfigService } from './remote-config.service';
import { LocalConfigService } from './local-config.service';
import { EvaAnswer } from 'src/app/shared/interfaces/eva-response-answer.interface';

@Injectable({
  providedIn: 'root'
})
export class EvaService {

  /**
   * Variable que obtendra la configuración por país del BOT
   */
  evaConsts: any = evaConstants;

  /**
   * Arreglo que contiene los mensajes de la conversación.
   *
   */
  chatMessages: ChatMessage[] = [];

  /**
   * Bandera que habilita o inhabilita el textArea en el que el usuario ingresa el texto.
   *
   */
  enableInput: boolean;

  /**
   * Código de la sesión.
   *
   */
  sessionCode: string;

  /**
   * Texto de respuesta
   * 
   */
  text: string;

  /**
   * Objeto de tupo Customer que contiene los datos del usuario.
   *
   */
  customer: Customer;

  /**
   * Código del último intent detectado por eVA.
   *
   */
  currentIntent = '';

  /**
   * Observable que devuelve un chatMessage cada que eVA responde.
   *
   */
  convObservable: Observable<ChatMessage>;

  /**
   *  Número de reintentos
   *
   */
  attemptCount = 0;

  constructor(
    public restService: RestService,
    private aRouter: ActivatedRoute,
    public router: Router,
   // public remoteConfigService: RemoteConfigService,
    public localConfigService: LocalConfigService,
    public utilsService: UtilsService
  ) { }

  /**
   * Método que devuelve un observable tras hacer una petición a eva.
   * @param text Texto del usuario.
   * @param code Código de la intención.
   * @param context Contextó de la interacción.
   */
  conversationManaged(text: string, code: string, context?: any) {
    this.convObservable = new Observable((observer) => {
      this.conversation(text, code, context, observer);
    });

    return this.convObservable;
  }

  /**
   * Método encargado de hacer las peticiones a eVA y retornar un obserbable cada que eVA responde.
   * Funciona de manera recursiva hasta que no hay ningún nextIntent en la respuesta de eVA
   *
   * @param text Texto que dijo el usuario.
   * @param code Código del controlador que de quiere consultar.
   * @param [context] Contexto de la conversación.
   * @param [observer] Observable al que se enviará la respuesta de eVA.
   */
  conversation(text: string, code: string, context?: any, observer?: Subscriber<ChatMessage>) {
    const self = this;
    const httpOptions: HttpOptions = { headers: this.evaConsts.HEADERS };
    this.utilsService.cleanText(text);
    const evaRequestBody = this.evaRequestBodyBuilder(text, code, context);
    let reqUrl;

    //identificar si llamado es para enviar resultados de encuesta de satisfacción
    if(code === this.evaConsts.CODES.FEEDBACK_CODE){
      
      const feedbackRequestBody = this.feedbackRequestBodyBuilder(context);
      reqUrl = `${this.localConfigService.config.url}/${this.sessionCode}/${this.localConfigService.config.feedback_url}`;
      this.restService.postRequest(reqUrl, feedbackRequestBody, httpOptions)
      .subscribe({
        next(data){
          try{
            console.log('data', data);
          } catch (error) {
            console.log('next error', error);
          }
        },
        error(error){
          console.log('error', error);
        }
      });

    
    //si no es envío de resultados de encuesta de satisfacción, llama a servicio de eva para seguir el flujo conversacional
    } else {

      reqUrl = `${this.localConfigService.config.url}/${this.sessionCode || ''}`;
      this.restService.postRequest(reqUrl, evaRequestBody, httpOptions)
      .subscribe({
        next(data) {
          try {
            if (data.exceptionName) {
              // const chatMessage: ChatMessage = new ChatMessage(1, true,
              //   ChatConstants.EVA.BROKER_ERROR, self.utilsService.setMessageTime());

              const chatMessage: ChatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                                  .withMessage( ChatConstants.EVA.BROKER_ERROR)
                                                  .isFromBot(true)
                                                  .build();
              observer.error(chatMessage);
              observer.complete();
              return;
            }
            const evaResponse: EvaResponse = data;
            self.currentIntent = evaResponse.answers[0].code;
            self.sessionCode = evaResponse.sessionCode;
            self.text = evaResponse.text;

            self.addBotMessage(evaResponse, observer);

            if (evaResponse.context.attempt_out || evaResponse.context.attempt_out === 0) {
              self.attemptCount = evaResponse.context.attempt_out + self.attemptCount;
            } else {
              self.attemptCount = 0;
            }

            /*
            if (evaResponse.context.nextIntent) {
              self.conversation('', evaResponse.context.nextIntent, null, observer);
              return;
            }

            if (evaResponse.answers[evaResponse.answers.length - 1].technicalText) {
              const technicalText: any = evaResponse.answers[evaResponse.answers.length - 1].technicalText;
              if (technicalText.nextIntent) {
                self.conversation('', technicalText.nextIntent, null, observer);
              }
              return;
            }
            */

            observer.complete();
          } catch (error) {
            console.error(error);
            // const chatMessage: ChatMessage = new ChatMessage(1, true, ChatConstants.EVA.OBSERVER_ERROR, self.utilsService.setMessageTime());
            const chatMessage: ChatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                                .withMessage( ChatConstants.EVA.OBSERVER_ERROR)
                                                .isFromBot(true)
                                                .build();
            observer.error(chatMessage);
          }
        },
        error(error) {
          console.error(error);
          // const chatMessage: ChatMessage = new ChatMessage(1, true,
          //   ChatConstants.EVA.HTTP_ERROR_RESPONSE, self.utilsService.setMessageTime());

          const chatMessage: ChatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                              .withMessage( ChatConstants.EVA.HTTP_ERROR_RESPONSE)
                                              .isFromBot(true)
                                              .build();

          observer.error(chatMessage);
        }
      });

    }
  }

  /**
   * Constructor del contexto para una petición a eVA.
   * Si no recibe un parámetro crea un contexto que contiene únicamente el prevIntent de la conversación.
   * Recupera del localStorare el customer_id, si no lo encuentra envíaun string vacío.
   *
   * @param [context] JSON con propiedades del contexto de la conversación.
   * @returns JSON con el contexto de la conversación.
   */
  contextBuilder(context?: any) {
    let customerId = '';
    if (typeof (Storage) !== undefined) {
      customerId = localStorage.getItem(this.customer.phoneNumber) !== null ?
        JSON.parse(localStorage.getItem(this.customer.phoneNumber)).customerId : '';
    }
    if (!context) {
      context = {
        prevIntent: this.currentIntent,
        email: this.customer.email
      };
    } else {
      context.prevIntent = this.currentIntent;
      context.email = this.customer.email;
    }

    if (this.attemptCount !== 0) {
      context.attempt_in = this.attemptCount;
    }
    context.customer_id = customerId;
    return context;
  }

  /**
   * Método que construye el cuerpo para realizar una petición a eVA.
   *
   * @param text Texto que dijo el usuario.
   * @param code Código de intención o controlador.
   * @param [context] JSON con propiedades del contexto de la conversación.
   * @returns Cuerpo de la petición a eVA en JSON.
   */
  evaRequestBodyBuilder(text: string, code: string, context?: any) {


    const evaRequestBody: any = {

    };

    // text,
    //  code,
    // context: this.contextBuilder(context)

    if (text != '') evaRequestBody['text'] = text;
    if (code != '') evaRequestBody['code'] = code;
    if (context) evaRequestBody['context'] = context;

    return evaRequestBody;
  }

  /**
   * Método que construye el cuerpo para realizar una petición al servicio de feedback de eva (satisfactions).
   * @param [context] JSON con el contenido de la evaluación.
   * @returns Cuerpo de la petición para el servicio de feedback.
   */
  feedbackRequestBodyBuilder(context?: any){
    const feedbackRequestBody: any = {
      evaluation: 0,
      answered: 1,
      userComments: '',
      expireSession: true
    };
    if (context.experience) feedbackRequestBody.evaluation = context.experience;
    if (context.comments) feedbackRequestBody.userComments = context.comments;
    return feedbackRequestBody;
  }

  /**
   * Crea un objeto de tipo ChatMessage a partir de un objeto EvaResponse.
   *
   * @param evaResponse Respuesta de eVA.
   * @returns Objeto de tipo ChatMessages creado a partir de la respuesta de eVA.
   */
  addBotMessage(evaResponse: EvaResponse, observer?: Subscriber<ChatMessage>) {

    //recorro las respuestas de eva
    for (const answer of evaResponse.answers) {
      //creo un chatmessage de texto plano
      const chatMessage: ChatMessage = this.buildChatMessage(answer);
      this.codeBehavior(chatMessage, evaResponse); 
      this.chatMessages.push(chatMessage);
      observer.next(chatMessage);

      //creo un chatmessage con opciones de boton
      // const chatOptions: ChatMessage = new ChatMessage(null, true, null, this.utilsService.setMessageTime());
      // chatMessage.message = '';

      // if (answer.type.toLowerCase() == 'image') {
      //   chatMessage.type = 3;
      //   chatMessage.image = answer.content;
      // }


      // if (answer.type.toLowerCase() == 'text' || answer.type.toLowerCase() == 'text_options') {
      //   chatMessage.message = answer.content + "<br>";
      //   chatMessage.type = 1;
      // }
      // if (answer.type.toLowerCase() == 'text_options' && answer.buttons && answer.buttons.length > 0) {
      //   chatOptions.options = answer.buttons;
      //   chatOptions.type = 2;
      // }


      // this.codeBehavior(chatMessage, evaResponse); 
      // this.chatMessages.push(chatMessage);
      // observer.next(chatMessage);
      
      // if (chatOptions.options) {
      //   this.chatMessages.push(chatOptions);
      //   observer.next(chatOptions);
      // }
      

      // if (typeof answer.technicalText != 'undefined') {
      //   const technicalText: any = answer.technicalText;
      //   if (technicalText.imageUrl) {
      //     var imgUrl = technicalText.imageUrl.split(".");
      //     for (let i = 0; i < imgUrl.length; i++) {
      //       if (imgUrl[i] == "png") {
      //         chatMessage.png = true;
      //         break;
      //       }
      //     }
      //     chatMessage.type = 3;
      //     chatMessage.image = technicalText.imageUrl;
      //   }
      //   if (technicalText.attachment) {
      //     chatMessage.type = 3;
      //     chatMessage.attachment = technicalText.attachment;
      //   }
      // }


    }
    // this.codeBehavior(chatMessage, evaResponse);
    // if (chatMessage.message) {
    //   this.chatMessages.push(chatMessage);
    //   observer.next(chatMessage);
    //   if (chatOptions.options) {
    //     this.chatMessages.push(chatOptions);
    //     observer.next(chatOptions);
    //   }
    // }
    // return chatMessage;
  }

  /**
   * Método que llama a otros métodos dependiendo del valor del contexto.
   *
   * @param chatMessage Mensaje generado de la respuesta de eva.
   * @param evaResponse Respuesta de eva
   */
  codeBehavior(chatMessage: ChatMessage, evaResponse: EvaResponse) {
    switch (this.currentIntent) {
      case this.evaConsts.CODES.END_CODE:
        chatMessage.shouldEnd = true;
        break;
      case this.evaConsts.CODES.DERIVE_CODE:
      case this.evaConsts.CODES.NONE:
        if (evaResponse.context.customer_token) {
          const customerId = evaResponse.context.customer_id;
          this.customer.customerId = customerId;
          localStorage.setItem(this.customer.phoneNumber, JSON.stringify(this.customer));
          const context = {
            customer_token: evaResponse.context.customer_token
          };
          chatMessage.context = context;
        }
        break;
    }
  }


  buildChatMessage(answer: EvaAnswer){

    switch(answer.type){
      case 'CAROUSEL':
        return new ChatMessage.Builder(CHATTYPE.CAROUSEL)
                   .withId(answer.id)
                   .withButtons(answer.buttons)
                   .isFromBot(true)
                   .withCarouselItems(answer.content)
                   .withTime(this.utilsService.setMessageTime())
                   .build();
      case 'TEXT':
        let chatType = CHATTYPE.SIMPLETEXT;
        let optionsForm = null;
        let technicalText = null;
        if(answer.technicalText) {
          if((answer.technicalText as any).type && (answer.technicalText as any).type.endsWith('option')) {
            // Technical Text es un multiselector de opciones
            chatType = CHATTYPE.OPTIONSFORM;
            optionsForm = answer.technicalText;
          } else {
            // Cualquier otro Technical Text
            chatType = CHATTYPE.TECHNICALTEXT;
            technicalText = answer.technicalText;
          }
        }
        return new ChatMessage.Builder(chatType)
                   .withId(answer.id)
                   .withMessage(answer.content)
                   .isFromBot(true)
                   .withButtons(answer.buttons.length > 0 ? answer.buttons : null)
                   .withTime(this.utilsService.setMessageTime())
                   .withOptionsForm(optionsForm)
                   .withTechnicalText(technicalText)
                   .build();
      case 'TEXT_OPTIONS':
        return new ChatMessage.Builder(CHATTYPE.OPTIONS)
                   .withId(answer.id)
                   .withButtons(answer.buttons)
                   .isFromBot(true)
                   .withMessage(answer.content)
                   .withTime(this.utilsService.setMessageTime())
                   .build();        
      case 'IMAGE':
        return new ChatMessage.Builder(CHATTYPE.IMAGE)
                   .withId(answer.id)
                   .isFromBot(true)
                   .withImage(answer.content)
                   .withTime(this.utilsService.setMessageTime())
                   .build();  
      case 'VIDEO':
        return new ChatMessage.Builder(CHATTYPE.VIDEO)
                   .withId(answer.id)
                   .isFromBot(true)
                   .withVideo(answer.content)
                   .withTime(this.utilsService.setMessageTime())
                   .build(); 
      case 'AUDIO':
        return new ChatMessage.Builder(CHATTYPE.AUDIO)
                   .withId(answer.id)
                   .isFromBot(true)
                   .withAudio(answer.content)
                   .withTime(this.utilsService.setMessageTime())
                   .build();          
      case 'FILE':
        return new ChatMessage.Builder(CHATTYPE.FILE)
                   .withId(answer.id)
                   .isFromBot(true)
                   .withLabel(answer.name)
                   .withAttachment(answer.content)
                   .withTime(this.utilsService.setMessageTime())
                   .build();    
    }

    return null;
  }
}
