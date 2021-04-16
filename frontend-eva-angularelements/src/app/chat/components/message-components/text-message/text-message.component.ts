import { ChatMessage } from './../../../models/chat-message.model';
import { Component, Input } from '@angular/core';
//import { RemoteConfigService } from 'src/app/chat/services/remote-config.service';

@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.component.html',
  styleUrls: ['./text-message.component.scss']
})
export class TextMessageComponent {

  /**
   * Objeto de tipo ChatMessage con información del mensaje.
   */
  @Input() chatMessage: ChatMessage;

  //constructor(private remoteConfigService: RemoteConfigService) { }
  constructor() { }
  
}
