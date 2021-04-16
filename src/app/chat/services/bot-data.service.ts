import { Injectable } from '@angular/core';
import { RestService } from 'src/app/shared/services/rest.service';
import { evaConstants, BOT_DATA_URL } from 'src/environments/environment';
import { ZurConst } from '../interfaces/zur-const.interface';
import { ChatConstants } from '../chat-constants';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class BotDataService {

  // ATRIBUTOS QUE REPRESENTAN INFORMACIÓN DEL BOT COMO NOMBRE E IMÁGENES
  public botName: string;
  public avatarDefault: string;
  public avatarAwake: string;
  public avatarSleeping: string;
  public avatarThankYou: string;
  private dataBot: any;
  private urlDataBot: string;
  public background: string;

  // ATRIBUTO QUE REPRESENTA MENSAJES DEL BOT
  public botMessages: any;

  constructor(
    private restService: RestService,
    private utilsService: UtilsService
  ) {

    this.dataBot = evaConstants;
    this.urlDataBot = BOT_DATA_URL;

    this.avatarDefault = this.dataBot.IMAGE.DEFAULT;
    this.avatarAwake = this.dataBot.IMAGE.AWAKE;
    this.avatarSleeping = this.dataBot.IMAGE.SLEEP;
    this.avatarThankYou = this.dataBot.IMAGE.THANK_YOU;
    this.background = this.dataBot.BACKGROUND;
  }

  /**
   * Método que mediante una petición get recibe un JSON con la información del bot e inicializa los datos del mismo.
   *
   */
  public initialize() {
    return new Observable((observer) => {
      this.restService.getRequest(this.urlDataBot)
        .subscribe(
          (data: ZurConst) => {
            console.groupCollapsed('%c Online Data ', 'color: white; background-color: #2274a5');
            console.log('%c Name ', 'color: white; background-color: #2274a5', data.bot_name);
            console.log('%c Bot Messages ', 'color: white; background-color: #2274a5');
            console.table(data.bot_messages);
            console.groupEnd();
            // this.botName = data.bot_name;
            this.botName = 'Pichincha';
            this.botMessages = data.bot_messages;
            this.background = data.background;
          },
          (err) => {
            console.error('%c Local Data ', 'color: white; background-color: #2274a5', 'Getting data from local');
            this.botMessages = ChatConstants.LIVE_CHAT.ERRORS;
            this.background = this.dataBot.BACKGROUND;
          },
          () => observer.complete()
        );
    });


  }


}
