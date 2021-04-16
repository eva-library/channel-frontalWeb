import { HeaderService } from './../../../shared/services/header.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, HostListener, ViewChildren, QueryList, Renderer2, Output, EventEmitter, APP_BOOTSTRAP_LISTENER, TemplateRef } from '@angular/core';
import { evaConstants } from 'src/environments/environment';
import { ChatService } from '../../services/chat.service';
import { UIService } from 'src/app/shared/services/ui.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ChatMessage, CHATTYPE } from '../../models/chat-message.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';
import { BotDataService } from '../../services/bot-data.service';
//import { RemoteConfigService } from '../../services/remote-config.service';
import { LocalConfigService } from '../../services/local-config.service';
import { HEADER_TYPE } from 'src/app/shared/components/header/header.component';

declare var require: any
const FileSaver = require('file-saver');


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [
    trigger('newMessage', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(400)
      ])
    ])
  ]
})
export class ChatComponent implements OnInit {

  /**
   * Variable que obtendra la configuración por país del BOT
   */
  evaConsts: any = evaConstants;

  background: string;

  showModalImage: boolean = false;
  png: boolean = false;
  image: string = null;

  @Output() onCloseChatBot: EventEmitter<any> = new EventEmitter();
  
  /**
   * Contenedor de los mensajes del chat.
   *
   */
  @ViewChild('boxMessageListscroller') public messageContainer: ElementRef;

  /**
   *  Si se cierra la ventana ejecuta la finalización del chat
   *
   */
  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.chatService.endConversation();
  }

  /**
   *  Si se cierra la ventana ejecuta la finalización del chat
   *
   */
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    this.chatService.endConversation();
  }

  /**
   *  Ante el evento mouseMove o keyPress "despierta" el avatar del chat.
   *
   */
  @HostListener('document:keypress', ['$event'])
  @HostListener('mousemove', ['$event'])
  handleEvent() {
    if (!this.chatService.derive) {
      if (!this.chatService.talkedWithAgent) {
        this.chatService.awakeAvatar();
      }
    }
  }

  @ViewChild("modalWindowDelete", { static: false } ) modalWindowDelete: TemplateRef<any>;

  //lista de referencias a los botones de los selectores de opciones
  @ViewChildren('optionsFormButton')
  optionsFormButtonsList: QueryList<ElementRef>;

  //lista de referencias a las cajas de texto para opciones que lo requieran
  @ViewChildren('optionsFormInput')
  optionsFormInputsList: QueryList<ElementRef>;

  //lista de referencias a los botones de confirmación de ingreso de opciones
  @ViewChildren('optionsFormButtonConfirm')
  optionsFormButtonsConfirmList: QueryList<ElementRef>;

  //Objeto con lista de opciones seleccionadas por pregunta
  chosenOptions: object = {};

  /**
   * Crea una instancia del componete ChatComponent
   * @param router usado para ajustar navegar a otra ruta o consultar la ruta actual.
   * @param headerService usado para consultar variable writting y para enviar la ruta actual.
   * @param evaService usado para acceder al arreglo de mensajes y consutar el sessionCode.
   * @param chatService usado para construir las peticiones que irán a eVA.
   * @param uiService usado para desplazarse hacia abajo en el contenedor de mensajes tras enviar o recibir un mensaje.
   */
  constructor(
    private router: Router,
    public headerService: HeaderService,
    public chatService: ChatService,
    public uiService: UIService,
    public utilsService: UtilsService,
    public botDataService: BotDataService,
    //private remoteConfigService: RemoteConfigService,
    private localConfigservice: LocalConfigService,
    private renderer: Renderer2,
    private modalService: NgbModal
    
  ) {
    //seleccionamos la configuración de eVA de acuerdo al país almacenado
    this.botDataService.initialize().subscribe(
      () => { },
      () => { },
      () => {
        this.background = this.botDataService.background;
      }
    );
  }

  /**
   * Verifica el estado del objeto customer, si es nulo redirige a customerForm, si no es nulo inicializa varibles de diferentes
   * servicios contruye un contexto y realiza la primera consulta al broker mediante el chatService.
   * Verifica que el customer no sea nulo, si lo es redirige a la página customerForm
   * Envía al header service la ruta actual para mostrar el header de la página de chat.
   * Envía como objetos el contenedor de mensajes y la caja de texto al chatService para que pueda tener acceso a ellos.
   * Establece la bandera writing del headerService en false.
   * Crea un contexto que contiene el nombre del usuario.
   * Realiza la primera consulta mediante el chatService enviando el text vacío, el código del init y el contexto anteriormente creado.
   */
  ngOnInit() {
    // if (!this.chatService.customer) {
      // this.router.navigateByUrl(`/customerForm?code=${this.utilsService.getParamValueQueryString('country')}`);
    // } else {

    
      let data = this.localConfigservice.syncParameters();
    
      this.chatService.setMessageContainer(this.messageContainer);

      this.chatService.initialize();

      this.uiService.writing = false;

      const context = {
        name:  this.chatService.customer ? this.chatService.customer.name : 'anonymous'
      };

      if(this.utilsService.getParamValueQueryString('id_session') != ''){

        const chatMessage: ChatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                              .withMessage('Tengo una cita con el codigo ' + this.utilsService.getParamValueQueryString('id_session'))
                                              .build();

        this.chatService.chatMessages.push(chatMessage);
        this.chatService.conversation('Tengo una cita con el codigo ' + this.utilsService.getParamValueQueryString('id_session'), '',null);
      }
      else
        this.chatService.conversation('', this.evaConsts.CODES.INIT_CODE, context);
      
      this.chatService.idle = null;
      this.chatService.end = null;
      this.chatService.idleTimeOut();
      this.chatService.endTimeOut();

     
    // }
  }

  /**
   * Establece en null el atributo options del objeto ChatMessage que recibe como parámetro.
   *
   * @param chatMessage Mensaje del que se desea eliminar el valor del atributo options
   */
  onOptionClick(chatMessage: ChatMessage) {
    chatMessage.buttons = null;
  }

  download_file(fileURL, fileName) {
    FileSaver.saveAs(fileURL, fileName);
  }

  showModal(img, imageExtension) {
    this.image = img;
    this.png = imageExtension;
    this.showModalImage = true;
  }

  closeModal() {
    this.showModalImage = false;
  }

  get CHATTYPE(){
    return CHATTYPE;
  }

  get HEADER_TYPE(){
    return HEADER_TYPE;
  }

  activeButtonMouseOver($event, typeButton){
    console.log('activeButtonMouseOver event', $event);
    let strClass = 'buttonOption';
    switch(typeButton){
      case 'button': strClass = 'buttonOption'; break;
      case 'confirm': strClass = 'buttonConfirm'; break;
      case 'image': break;
    }
    if(!("ontouchstart" in document.documentElement)) {
      if(typeButton !== 'image'){
        this.renderer.addClass($event.srcElement, `${strClass}Hover`);
        this.renderer.removeClass($event.srcElement, strClass);
      } else {
        $event.srcElement.src = '../../../../assets/img/trash_active.svg';
      }
      
    }
  }

  deactiveButtonMouseOut($event, typeButton){
    let strClass = 'buttonOption';
    switch(typeButton){
      case 'button': strClass = 'buttonOption'; break;
      case 'confirm': strClass = 'buttonConfirm'; break;
      case 'image': break;
    }
    if(!("ontouchstart" in document.documentElement)) {
      if(typeButton !== 'image') {
        this.renderer.addClass($event.srcElement, strClass);
        this.renderer.removeClass($event.srcElement, `${strClass}Hover`);
      } else {
        $event.srcElement.src = '../../../../assets/img/trash_inactive.svg';
      } 
    }
  }

  

  async doActionList(code: string, accion: string, messageIndex: number) {
    
    console.log('doActionList accion', accion);
    console.log('doActionList code', code);

    const chatMessage: ChatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                                    .build();
    this.chatService.chatMessages.push(chatMessage);
    
    let context = { accion } as any;
    switch(accion) {

      case 'AGREGAR_MAS_PRODUCTOS':

        //"recordar" cantidades
        for(let keyCode in this.chatService.objListaMaterialesSeleccionados){
          let arrFormInputs = this.optionsFormInputsList['_results']
                  .filter(input => input.nativeElement.id === `quant_${messageIndex}_${keyCode}`);
          if(arrFormInputs.length > 0){
            this.chatService.objListaMaterialesSeleccionados[keyCode] = parseInt(arrFormInputs[0].nativeElement.value);
          }
        }
        console.log('doActionList context', context);
        this.chatService.conversationWithEva('', '', context);
        this.chatService.awakeAvatar();

        break;
      
      case 'ELIMINAR_PRODUCTO':
        this.modalService.open(this.modalWindowDelete, { windowClass: 'custom-class' })
          .result
          .then(result => {
            console.log('doActionList result', result);
            if(result === 'SI') {
              context.del_code = code;
              delete this.chatService.objListaMaterialesSeleccionados[code];
              console.log('doActionList context', context);
              this.chatService.conversationWithEva('', '', context);
              this.chatService.awakeAvatar();
            }
          }, error => error);
          break;
        
      case 'CONFIRMAR_SELECCION':
        context.listaMaterialesSeleccionados = [];
        for(let keyCode in this.chatService.objListaMaterialesSeleccionados){
          //obtener cantidad del material desde los inputs (actualizar)
          let arrFormInputs = this.optionsFormInputsList['_results']
                  .filter(input => input.nativeElement.id === `quant_${messageIndex}_${keyCode}`);
          if(arrFormInputs.length > 0) {
            context.listaMaterialesSeleccionados.push({ code: keyCode, text: arrFormInputs[0].nativeElement['data-text'], quantity: parseInt(arrFormInputs[0].nativeElement.value) });
          }
        }
        console.log('doActionList context', context);
        this.chatService.conversationWithEva('', '', context);
        this.chatService.awakeAvatar();
        break;

    }

  }

  pushMessage(type: CHATTYPE, chatMessage: ChatMessage, value: string){

    chatMessage.buttons = null;
    

    const newChatMessage: ChatMessage = new ChatMessage.Builder(type)
                                                    .withMessage( value)
                                                    .withTime(this.utilsService.setMessageTime())
                                                    .build();
    this.chatService.chatMessages.push(newChatMessage);
    this.chatService.conversationWithEva(value, '', null);
    this.chatService.awakeAvatar();
  }

  pushOption(optionsForm: object, optionSelected: object, messageIndex: number) {

    if(!this.chosenOptions.hasOwnProperty(`${(optionsForm as any).code}_${messageIndex}`)) {
      this.chosenOptions[`${(optionsForm as any).code}_${messageIndex}`] = [];
    }

    console.log('chosenOptions prev', this.chosenOptions);

    let arrChosenOptions = this.chosenOptions[`${(optionsForm as any).code}_${messageIndex}`];

    let arrSelectedButton = 
      this.optionsFormButtonsList['_results']
          .filter(
            button => button.nativeElement.id === `${(optionsForm as any).code}_${(optionSelected as any).code}_${messageIndex}`
          );
    
    if(arrSelectedButton.length > 0) {

      let arrSelectedOption = arrChosenOptions.filter(option => option.code === (optionSelected as any).code);
      if(arrSelectedOption.length > 0) {
        //Opción ya está seleccionada en selector, quitarla:
        this.renderer.addClass(arrSelectedButton[0].nativeElement, 'buttonOption');
        this.renderer.removeClass(arrSelectedButton[0].nativeElement, 'buttonOptionSelected');
        let indexSelectedOption = arrChosenOptions.reduce((prevIndex, option, index) => { return (option.code === arrSelectedOption[0].code) ? index : prevIndex }, -1);
        arrChosenOptions.splice(indexSelectedOption, 1);
      } else {
        //Opción no está seleccionada en selector
        if((optionsForm as any).type === 'one-option' || (optionSelected as any).code === 'NO'){
          //Si es selector one-option o está seleccionando "Ninguno/Ninguna", eliminar cualquier otra opción seleccionada:
          this.optionsFormButtonsList['_results']
              .filter(button => {
                let arrSelectedOption = arrChosenOptions.filter(option => button.nativeElement.id === `${(optionsForm as any).code}_${option.code}_${messageIndex}`);
                return arrSelectedOption.length > 0;
              })
              .map(button => {
                this.renderer.removeClass(button.nativeElement, 'buttonOptionSelected');
                this.renderer.addClass(button.nativeElement, 'buttonOption');
                let indexSelectedOption = arrChosenOptions
                  .reduce((prevIndex, option, index) => { return (button.nativeElement.id === `${(optionsForm as any).code}_${option.code}_${messageIndex}`) ? index : prevIndex }, -1);
                arrChosenOptions.splice(indexSelectedOption, 1);
              });
        } else {
          //Si no es selector one-option y la opción selecionada no es "Ninguno/Ninguna", desactivar opción "Ninguno/Ninguna" (si estuviera seleccionada)
          let arrNoButton = 
            this.optionsFormButtonsList['_results']
                .filter(button => button.nativeElement.id === `${(optionsForm as any).code}_NO_${messageIndex}`);
          if(arrNoButton.length > 0) {
            let indexNoOption = arrChosenOptions
              .reduce((prevIndex, option, index) => option.code === 'NO' ? index : prevIndex , -1);
            if(indexNoOption >= 0){
              this.renderer.removeClass(arrNoButton[0].nativeElement, 'buttonOptionSelected');
              this.renderer.addClass(arrNoButton[0].nativeElement, 'buttonOption');
              arrChosenOptions.splice(indexNoOption, 1);
            }
          }
        }
        //Agregar la opción seleccionada:
        this.renderer.addClass(arrSelectedButton[0].nativeElement, 'buttonOptionSelected');
        this.renderer.removeClass(arrSelectedButton[0].nativeElement, 'buttonOption');
        arrChosenOptions.push({ code: (optionSelected as any).code });
      }

      //Si las opciones que incluyen texto adicional quedaron seleccionadas, mostrar inputs para texto correspondientes:
      (optionsForm as any).options
        .filter(option => option.additionalText) //opciones del formulario con texto adicional
        .map(formOptionAddText => {
          let arrFormInputs = 
          this.optionsFormInputsList['_results']
              .filter(input => input.nativeElement.id === `${(optionsForm as any).code}_${formOptionAddText.code}_${messageIndex}_TEXT`);
          if (arrFormInputs.length > 0) { 
            if(arrChosenOptions.filter(chosenOption => chosenOption.code === formOptionAddText.code).length > 0) {
              //si quedó seleccionada, mostrar input
              this.renderer.addClass(arrFormInputs[0].nativeElement, 'inputOptionSelected');
              this.renderer.removeClass(arrFormInputs[0].nativeElement, 'inputOption');
            } else {
              //si no quedó seleccionada, ocultar input
              this.renderer.removeClass(arrFormInputs[0].nativeElement, 'inputOptionSelected');
              this.renderer.addClass(arrFormInputs[0].nativeElement, 'inputOption');
              arrFormInputs[0].nativeElement.value = '';
            }
          }
        });

    }

    this.chosenOptions[`${(optionsForm as any).code}_${messageIndex}`] = arrChosenOptions;

    console.log('chosenOptions post', this.chosenOptions);

  }

  //basado en sendMessage() en chat-input-box.component.ts
  sendOptions(optionsForm: object, messageIndex: number){
  
    //se valida que exista el objeto que almacena las opciones seleccionadas y además que hayan opciones seleccionadas
    if(this.chosenOptions[`${(optionsForm as any).code}_${messageIndex}`]){
      if(this.chosenOptions[`${(optionsForm as any).code}_${messageIndex}`].length > 0){

        //Almacenar texto adicional de las opciones de formulario que lo incluyen
        let sendingOptions = {};
        let codeFormLowerCase = (optionsForm as any).code.toLowerCase().replace("_",""); //a eva se debe enviar la key en minúsculas y sin "_" (así está en el middleware)
        sendingOptions[codeFormLowerCase] = this.chosenOptions[`${(optionsForm as any).code}_${messageIndex}`];
        (optionsForm as any).options
            .filter(option => option.additionalText) //opciones del formulario con texto adicional
            .map(formOptionAddText => {
              let arrFormInputs = 
              this.optionsFormInputsList['_results']
                  .filter(input => input.nativeElement.id === `${(optionsForm as any).code}_${formOptionAddText.code}_${messageIndex}_TEXT`);
              if (arrFormInputs.length > 0) { 
                let indexSendingOptionAddText = sendingOptions[codeFormLowerCase]
                  .reduce((prevIndex, option, index) => option.code === formOptionAddText.code ? index : prevIndex, -1);
                if(indexSendingOptionAddText >= 0) {
                  sendingOptions[codeFormLowerCase][indexSendingOptionAddText].additionalText = arrFormInputs[0].nativeElement.value;
                }
              }
            });
        
        //Enviar a eva
        const userChatMessage = new ChatMessage.Builder(CHATTYPE.OPTIONSFORM)
          .withOptionsForm(sendingOptions)
          .withTime(this.utilsService.setMessageTime())
          .build()
        this.chatService.chatMessages.push(userChatMessage);
        this.uiService.scrollToBottom(this.chatService.messageContainer);
        this.chatService.conversation('', '', sendingOptions);

        //Despertar avatar
        if (!this.chatService.derive) {
          this.chatService.awakeAvatar();
        }

        //Desactivar botón de "Confirmar"
        let arrFormButtonsConfirm =  this.optionsFormButtonsConfirmList['_results']
          .filter(button => button.nativeElement.id === `${(optionsForm as any).code}_${messageIndex}_CONFIRM`)
        if (arrFormButtonsConfirm.length > 0) {
          this.renderer.removeClass(arrFormButtonsConfirm[0].nativeElement, 'buttonConfirm');
          this.renderer.addClass(arrFormButtonsConfirm[0].nativeElement, 'buttonConfirmSelected');
          this.renderer.setAttribute(arrFormButtonsConfirm[0].nativeElement, 'disabled', 'disabled');
        }

      }
    }

  }
  
  fireCloseChatBot(): void {
    this.onCloseChatBot.emit();
  }

}
