import { HeaderService } from './../../services/header.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatService } from 'src/app/chat/services/chat.service';
import { UIService } from '../../services/ui.service';
import { BotDataService } from 'src/app/chat/services/bot-data.service';
//import { RemoteConfigService } from 'src/app/chat/services/remote-config.service';
import { LocalConfigService } from '../../../chat/services/local-config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() headerType: HEADER_TYPE;

  @Output() onCloseChatFeedback: EventEmitter<any> = new EventEmitter();
  @Output() onCloseChatBot: EventEmitter<any> = new EventEmitter();


  constructor(
    public headerService: HeaderService,
    public chatService: ChatService,
    public uiService: UIService,
    public botDataService: BotDataService,
    //public remoteConfigService: RemoteConfigService
    public localConfigService: LocalConfigService
  ) { 

    
  }

  /**
   * Finaliza el chat enviando el código de finalización a eVA.
   *
   */
  eventEndChat() {
    // this.chatService.endConversation();
    // this.chatService.endChat();
    this.fireCloseChatBot();
  }


  get HEADER_TYPE(){
    return HEADER_TYPE;
  }


  eventCloseChat(){
    // var ifrm = window.frameElement; // reference to iframe element container
    // var doc = ifrm.ownerDocument;
    // ifrm.remove();

    // window.parent.postMessage({type : 'chatbubble', state: false}, '*');
    this.fireCloseFeedback();

  }

  fireCloseChatBot(): void {
    this.onCloseChatBot.emit();
  }


  fireCloseFeedback(): void {
    this.onCloseChatFeedback.emit();
  }

}


export enum HEADER_TYPE{
  CUSTOMER_FORM = 0,
  CHAT = 1,
  FEEDBACK_FORM = 2
}