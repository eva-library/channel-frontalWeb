import { HeaderService } from './../../../shared/services/header.service';
import { Customer } from './../../models/customer.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { BotDataService } from '../../services/bot-data.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
//import { RemoteConfigService } from '../../services/remote-config.service';
import { LocalConfigService } from '../../services/local-config.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  /**
   * Formulario para los datos del usuario.
   *
   */
  public contactForm: FormGroup;

  /**
   * Objeto de tipo customer en el que se guardarán los datos del usuario.
   *
   */
  customer: Customer;

  /**
   * Variable que indica que todo el contenido de la página ha cargado
   *
   */
  contentLoaded = false;

  /**
   * Varible que contiene el nombre del bot
   *
   */
  botName = '';
  background = '';
  country = '';
  gretting = '';

  constructor(
    private router: Router,
    public headerService: HeaderService,
    public chatService: ChatService,
    public botDataService: BotDataService,
    private utilsService: UtilsService,
    private location: Location,
    //public remoteConfigService: RemoteConfigService
    public localConfigService: LocalConfigService
  ) {
    this.country = this.utilsService.getParamValueQueryString('country');
  }

  /**
   * Crea un Customer con datos vacíos.
   * Ajusta ruta actual en el router.
   * Inicializa la data del botDataService.
   *
   */
  ngOnInit() {
    this.customer = {
      name: '',
      phoneNumber: '',
      email: '',
      customerId: '',
      customerToken: ''
    };
    let url =  this.router.url.split('?')[0];
    if (!this.utilsService.validateHasParamsUrl(url, 'code')) {
      // url = url + `?code=DEFAULT`;
      // location.assign(url + `?code=DEFAULT`)
    }
    this.headerService.setRoute(url);
    this.botDataService.initialize().subscribe(
      () => { },
      () => { },
      () => {
        
        this.headerService.setResources();
        this.botName = this.botDataService.botName;
        this.background = this.botDataService.background;
        this.contentLoaded = true;

        // Comentado por que no tenemos multipaises y ademas el mensaje es otro
        // if (this.country == '57') {
        //   this.gretting = `Hola, soy ${this.botName}, la nueva <b>asistente virtual</b> de Zurich Colombia. ¡Ingresa tus datos y cuéntame cómo te puedo ayudar!`;
        // } else {
        //   this.gretting = `Hola, soy ${this.botName} tú <b>asistente virtual</b> de Zurich Ecuador. ¡Ingresa tus datos y cuéntame cómo te puedo ayudar!`;
        // }

        // Mensaje de bienvenida generico
        // this.gretting = `Hola, soy ${this.botName} tú <b>asistente virtual</b>. ¡Ingresa tus datos y cuéntame cómo te puedo ayudar!`

      }
    );
  }

  /**
   * Redirige a la pantalla de chat
   */
  navigateToChat() {
    this.router.navigateByUrl(`/chat?code=` + this.utilsService.getParamValueQueryString('code'));
  }


  /**
   * Inicializa el los valores del usuario de tipo Customer con los valores del formulario.
   *
   */
  onSubmit() {
    if (typeof (Storage) !== undefined) {
      if (localStorage.getItem(this.customer.phoneNumber) !== null) {
        const storageCustomer: Customer = JSON.parse(localStorage.getItem(this.customer.phoneNumber));
        if (storageCustomer.customerId !== '') {
          this.customer.customerId = storageCustomer.customerId;
        }
      }
      this.customer.name = this.utilsService.formatName(this.customer.name);
      localStorage.setItem(this.customer.phoneNumber, JSON.stringify(this.customer));
      this.chatService.customer = this.customer;
    }
    this.navigateToChat();
  }

}
