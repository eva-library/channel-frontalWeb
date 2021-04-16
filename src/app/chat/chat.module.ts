// Modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChatRoutingModule } from './chat-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

// Components
import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { ChatComponent } from './components/chat/chat.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import { TextMessageComponent } from './components/message-components/text-message/text-message.component';
import { OptionsMessageComponent } from './components/message-components/options-message/options-message.component';
import { ModalImageComponent } from './components/modal-image/modal-image.component';

// Service
import { EvaService } from './services/eva.service';
import { ChatService } from './services/chat.service';
import { LivechatService } from './services/livechat.service';

import { CarouselComponent } from './components/carousel/carousel.component';
import { SafePipe } from './pipes/safe.pipe';
import {IvyCarouselModule} from 'angular-responsive-carousel';

@NgModule({
  declarations: [
    CustomerFormComponent,
    ChatComponent,
    FeedbackFormComponent,
    TextMessageComponent,
    OptionsMessageComponent,
    ModalImageComponent,
    CarouselComponent  ,
    SafePipe
  ],
    imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    SharedModule,
    IvyCarouselModule
  ],
  providers: [
    EvaService,
    ChatService,
    LivechatService
    
  ],
  exports: [ChatComponent, SafePipe,FeedbackFormComponent]
})
export class ChatModule { }
