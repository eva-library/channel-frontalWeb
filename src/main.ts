import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = () => { };
    window.console.table = () => { };
    window.console.group = () => { };
    window.console.groupCollapsed = () => { };
    window.console.groupEnd = () => { };
    window.console.count = () => { };
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => err);
