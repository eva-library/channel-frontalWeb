import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//import { RemoteConfigService } from '../chat/services/remote-config.service';
import { LocalConfigService } from '../chat/services/local-config.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  
  chatOpen: boolean = false;
  isFeedback: boolean = false;
  currentBot: number = -1;
  iframeUrl: SafeResourceUrl;
  @ViewChild('boxChatFrame') boxChatFrame;

  //constructor(public router: Router, public remoteConfigService: RemoteConfigService, private sanitizer: DomSanitizer) { }
  constructor(
    public router: Router, 
    public localConfigService: LocalConfigService, 
    private sanitizer: DomSanitizer) { }

  ngOnInit() {    
        this.currentBot = 0;
        // this.iframeUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(`chat?code=Transbank_transbank_STD`);
        this.localConfigService.appcode = this.localConfigService.configAll[this.currentBot].code;
        this.localConfigService.setCurrentConfig(this.localConfigService.configAll[this.currentBot]);

      
  }

  @HostListener("window:message",["$event"])
  openChat(param){
    if(param.data.type == 'chatbubble') 
      this.chatOpen = param.data.state;
  }


  showbot(){
    
    if(this.currentBot == -1) return;
    
    this.iframeUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(`chat?code=Transbank_transbank_STD`);
    this.localConfigService.appcode = this.localConfigService.configAll[this.currentBot].code;
    this.localConfigService.setCurrentConfig(this.localConfigService.configAll[this.currentBot]);
  }

  closeChatBot () {
    this.isFeedback = true;
  }

  closeChAtFeedback() {
    this.isFeedback = false;
    this.chatOpen = false;
  }
  
}
