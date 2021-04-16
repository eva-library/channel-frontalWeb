import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from 'src/app/chat/services/chat.service';
import { ChatMessage, CHATTYPE } from 'src/app/chat/models/chat-message.model';
import { UIService } from '../../services/ui.service';
import { UtilsService } from '../../services/utils.service';
import { HeaderService } from '../../services/header.service';
//import { RemoteConfigService } from 'src/app/chat/services/remote-config.service';
import { LocalConfigService } from '../../../chat/services/local-config.service';

@Component({
  selector: 'app-chat-input-box',
  templateUrl: './chat-input-box.component.html',
  styleUrls: ['./chat-input-box.component.scss']
})
export class ChatInputBoxComponent implements OnInit {

  /**
   * Caja de texto para enviar mensajes al chat.
   *
   */
  @ViewChild('textbox') public inputBox: ElementRef;

  /**
   * Valor de la caja de texto que envía los mensajes al chat.
   *
   */
  inputValue = '';

  constructor(
    private chatService: ChatService,
    public uiService: UIService,
    public headerService: HeaderService,
    //public remoteConfigService: RemoteConfigService,
    public localConfigService: LocalConfigService,
    private utilsService: UtilsService
  ) { }

  /**
   * Referencia el input box del chat service como el input box de este componente.
   *
   */
  ngOnInit() {
    this.chatService.setInputBox(this.inputBox);
  }

  /**
   * Verifica si el valor de la caja de texto es un espacio, si lo es establece el valor como vacío.
   * Si el valor de imput no es vacio crea un objeto de tipo ChatMessage cuyo atributo message< es igual al valor de la caja de texto.
   * Tras crear el objeto lo inserta en el arreglo chatMessages del evaService y establece el valor de la caja de texto como vacío.
   *
   */
  sendMessage() {
    if (/\S/.test(this.inputValue)) {
      this.inputValue = this.inputValue.replace(/\n/, '');
      // const userChatMessage = new ChatMessage(1, false, this.inputValue, this.utilsService.setMessageTime());

      const userChatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
      .withMessage(this.inputValue)
      .withTime(this.utilsService.setMessageTime())
      .build();
      
      this.chatService.chatMessages.push(userChatMessage);
      this.uiService.scrollToBottom(this.chatService.messageContainer);
      this.chatService.conversation(this.inputValue, '', null);
    }
    this.inputValue = '';
    if (!this.chatService.derive) {
      this.chatService.awakeAvatar();
    }
  }
}
