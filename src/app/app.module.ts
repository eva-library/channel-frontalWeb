import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Rutas
import { ChatModule } from './chat/chat.module';
import { AppRoutingModule } from './app-routing.module';

// Servicios

// Componentes
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
//import { environment } from 'src/environments/environment';
import { AngularFireRemoteConfigModule, SETTINGS, DEFAULTS } from '@angular/fire/remote-config';
import { AngularFireModule } from '@angular/fire';
import { FormRequiredGuard } from './chat/guards/formrequired.guard';
import { DemoComponent } from './demo/demo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Injector } from '@angular/core';  
import { createCustomElement } from '@angular/elements';  

import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ChatModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule
    //AngularFireModule.initializeApp(environment.firebaseConfig)
    //AngularFireRemoteConfigModule
  ],
  
  providers: [
    // { provide: DEFAULTS, useValue: { enableAwesome: true } },
    {
      provide: SETTINGS,
      useValue: {fetchTimeoutMillis: 5000}
    },
   
    FormRequiredGuard
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(AppComponent, { injector });
    customElements.define('eva-frontend', el);
  }
  
 }
