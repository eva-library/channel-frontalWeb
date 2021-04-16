import { evaConstants } from './../../../../environments/environment';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { HeaderService } from '../../../shared/services/header.service';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { BotDataService } from '../../services/bot-data.service';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';
import { LivechatService } from '../../services/livechat.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
//import { RemoteConfigService } from '../../services/remote-config.service';
import { LocalConfigService } from '../../services/local-config.service';
import { HEADER_TYPE } from 'src/app/shared/components/header/header.component';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(400)
      ])
    ])
  ]
})

export class FeedbackFormComponent implements OnInit {

  @Output() onCloseChatFeedback: EventEmitter<any> = new EventEmitter();

  
  evaConsts: any = evaConstants;
  /**
   * TextArea en la que el usuario escribe sus comentarios.
   *
   */
  @ViewChild('comments') private comments: ElementRef;

  /**
   * Bandera que indica si ya se envió el formulario.
   *
   */
  complete = false;

  /**
   * Objeto para contener los valores de la encuesta de satisfacción.
   *
   */
  feedback: any = {
    experience: 0,
    comments: ''
  };

  /**
   * Variable que mmuestra la imagen y el mensaje de agradecimiento cuando el usuario ha llenado la encuesta.
   *
   */
  showThanks = false;

  constructor(
    private router: Router,
    public headerService: HeaderService,
    public chatService: ChatService,
    public botDataService: BotDataService,
    private liveChatService: LivechatService,
    public utilsService: UtilsService,
    //private remoteConfigService: RemoteConfigService
    private localConfigService: LocalConfigService
  ) { }

  /**
   * Ajusta la ruta de la vista actual en el router.
   */
  ngOnInit() {
    
    this.headerService.setRoute(this.router.url.split('?')[0]);
    this.complete = false;
    if (this.chatService.derive) {
      this.liveChatService.livechatClose();
    }
  }

  /**
   * Envía los datos del formulario al broker y redirige a la pantalla inicial.
   *
   */
  sendFeedback() {
    this.feedback.comments = this.comments.nativeElement.value;
    if (this.feedback.experience || this.feedback.comments) {
      this.chatService.conversation('', this.evaConsts.CODES.FEEDBACK_CODE, this.feedback);
    }
    this.complete = true;
  }


  get HEADER_TYPE(){
    return HEADER_TYPE;
  }

  fireCloseFeedback(): void {
    this.onCloseChatFeedback.emit();
  }
}
