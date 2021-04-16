import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ChatInputBoxComponent } from './components/chat-input-box/chat-input-box.component';

import { HeaderService } from './services/header.service';
import { UIService } from './services/ui.service';
import { UtilsService } from './services/utils.service';

@NgModule({
  declarations: [HeaderComponent, NotFoundComponent, ChatInputBoxComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    HeaderComponent,
    ChatInputBoxComponent
  ],
  providers: [
    HeaderService,
    UIService,
    UtilsService
  ]
})
export class SharedModule { }
