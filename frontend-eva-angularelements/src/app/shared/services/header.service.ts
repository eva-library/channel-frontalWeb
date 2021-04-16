import { Injectable } from '@angular/core';
import { EvaService } from 'src/app/chat/services/eva.service';
import { BotDataService } from 'src/app/chat/services/bot-data.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  /**
   * Ruta activa.
   *
   */
  public route: string;

  /**
   * Tipo de contenido activo en el header.
   *
   */
  public activeHeaderContent: number;

  /**
   * Variable que indica si el bot está procesando una petición o un agente humano está escribiendo.
   *
   */
  public writing: boolean;

  /**
   * URL de la imagen a mostrr en el espacio de avatar.
   *
   */
  public avatarImageURL: string;

  /**
   * Nombre del bot o la persona con la que está hablando el usuario.
   *
   */
  public avatarName: string;
  public background: string;

  /**
   * Constante con la ruta de la vista customerForm
   */
  public ROUTE_CUSTOMER_FORM = '/customerForm';

  /**
   * Constante con la ruta de la vista chat
   */
  public ROUTE_CHAT = '/chat';

  /**
   * Constante con la ruta de la vista feedbackForm
   */
  public ROUTE_FEEDBACK = '/feedbackForm';

  constructor(
    public evaService: EvaService,
    private botDataService: BotDataService,
    private utilsService: UtilsService
  ) {
    this.activeHeaderContent = 0;
    this.avatarName = this.botDataService.botName;
    this.background = this.botDataService.background;
    this.avatarImageURL = this.botDataService.avatarAwake;
  }

  /**
   * Método que inicializa el nombre y la URL de la imagen del avatar.
   */
  setResources() {
    this.avatarName = this.botDataService.botName;
    this.background = this.botDataService.background;
    this.avatarImageURL = this.botDataService.avatarAwake;
  }

  /**
   * Método que ajusta el valor de la ruta actual.
   *
   * @param route Valor de ruta actual.
   */
  setRoute(route: string) {
    this.route = `${route}`;
    //agregamos params a la url
    this.addParamsHeader()
  }

  addParamsHeader(){
    let country = this.utilsService.getParamValueQueryString('country');
    let addParam = country ? `?country=${country}` : '';
    // if(!this.utilsService.validateHasParamsUrl(this.ROUTE_CUSTOMER_FORM, 'country')){
    //   this.ROUTE_CUSTOMER_FORM = this.ROUTE_CUSTOMER_FORM + addParam;
    // }
    // if(!this.utilsService.validateHasParamsUrl(this.ROUTE_CHAT, 'country')){
    //   this.ROUTE_CHAT = this.ROUTE_CHAT + addParam;
    // }

    // if(!this.utilsService.validateHasParamsUrl(this.ROUTE_FEEDBACK, 'country')){
    //   this.ROUTE_FEEDBACK = this.ROUTE_FEEDBACK + addParam;
    // }
  }

  /**
   * Método que ajusta la imagen del avatar despierto o dormido según el valor que recibe.
   *
   * @param sleep Si sleep es true se muestra la imagen del avatar durmiendo, si es false se ajusta la imagen del avsatar despierto.
   */
  sleepAvatar(sleep: boolean) {
    this.avatarImageURL = sleep ? this.botDataService.avatarSleeping : this.botDataService.avatarAwake;
  }

  /**
   * Método que cambia los datos del header a los datos del bot.
   *
   */
  setBot() {
    this.avatarImageURL = this.botDataService.avatarAwake;
    this.avatarName = this.botDataService.botName;
    this.background = this.botDataService.background;
  }

  /**
   * Método que cambia los datos del header a los datos del agente.
   *
   * @param name Nombre del agente.
   * @param imageURL URL de la imagen del agente.
   */
  setAgent(name: string, imageURL: string) {
    this.avatarName = name;
    this.avatarImageURL = imageURL;
  }
}
