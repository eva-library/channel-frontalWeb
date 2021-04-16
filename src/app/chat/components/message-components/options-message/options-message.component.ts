import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EvaOption } from 'src/app/shared/interfaces/eva-options.interface';
import { ChatService } from 'src/app/chat/services/chat.service';
import { ChatMessage, CHATTYPE } from 'src/app/chat/models/chat-message.model';
import { UtilsService } from 'src/app/shared/services/utils.service';
//import { RemoteConfigService } from 'src/app/chat/services/remote-config.service';

@Component({
  selector: 'app-options-message',
  templateUrl: './options-message.component.html',
  styleUrls: ['./options-message.component.scss']
})
export class OptionsMessageComponent {

  /**
   * Arreglo de objetos de tipo EvaOption con información de los botones.
   *
   */
  @Input() options: EvaOption[];

  /**
   * Evento que se emite cuando se presiona un botón.
   *
   */
  @Output() show = new EventEmitter<boolean>(true);

  constructor(
    public chatService: ChatService,
    public utilsService: UtilsService
    //private remoteConfigService: RemoteConfigService
    ) { }

  /**
   * Hace una petición a eva enviando como text o code el valor del botón.
   *
   * @param option valor del botón.
   */
  selectOption(option: EvaOption) {
    const chatMessage: ChatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                                    .withMessage( option.name)
                                                    .build();
    this.chatService.chatMessages.push(chatMessage);

    if (option.action) {
      this.chatService.conversationWithEva('', option.name, null);
    } else {
      this.chatService.conversationWithEva(option.name, '', null);
    }
    this.chatService.awakeAvatar();
    this.show.emit(false);
  }

}
