import { Component, Input } from '@angular/core';
import { CarouselItem, ChatMessage, CHATTYPE } from '../../models/chat-message.model';
import { EvaOption } from 'src/app/shared/interfaces/eva-options.interface';
import { ChatService } from '../../services/chat.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
//import { RemoteConfigService } from '../../services/remote-config.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {

  @Input() items : CarouselItem[]

  constructor(public chatService: ChatService,
    public utilsService: UtilsService)
    //private remoteConfigService: RemoteConfigService) { }
    {}


  doAction(button: EvaOption){

    console.log('doAction button', button);

    if(button.action !== ''){
      window.open(button.action, "_blank");
      return;
    }

    const chatMessage: ChatMessage = new ChatMessage.Builder(CHATTYPE.SIMPLETEXT)
                                                    //.withMessage( button.name)
                                                    .build();
    this.chatService.chatMessages.push(chatMessage);
    //this.chatService.conversationWithEva(button.name, '', null);
    this.chatService.conversationWithEva('', '', { add_code: button.value });
    this.chatService.objListaMaterialesSeleccionados[button.value] = 1; //materiales inicialmente se agregan con cantidad 1

    this.chatService.awakeAvatar();
    // this.show.emit(false);
      
  }

}
