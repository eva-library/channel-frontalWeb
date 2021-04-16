import { Component } from '@angular/core';
import { LocalConfigService } from './chat/services/local-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Everis Chatbot';

  constructor(public localConfigService: LocalConfigService){
    
  }

}
