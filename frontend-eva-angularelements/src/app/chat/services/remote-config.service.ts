import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AngularFireRemoteConfig } from '@angular/fire/remote-config';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {

  appcode = '';
  attemptCount = 0;
  config: any = null;
  configAll: any = null;

  constructor(
    public router: Router,
    public utilsService: UtilsService,

    public remoteConfig: AngularFireRemoteConfig
  ) {



    this.appcode = utilsService.getParamValueQueryString('code');

    this.syncParameters().then();

    remoteConfig.lastFetchStatus.then(status => {
      console.log(status);
    });


  }

  syncParameters(): Promise<any> {

    
    return new Promise((resolve, reject)=>{
        if(this.config != null) resolve(this.config);

        this.remoteConfig.fetchAndActivate().then(() => {
           this.remoteConfig.strings.subscribe((objeto) => {
            if (Object.keys(objeto).length !== 0) {
              this.setConfigAll(objeto);
              if(this.appcode != '')
                this.setCurrentConfig(JSON.parse(objeto[this.appcode]))

                resolve(this.config);
            }
            else {
              console.log('no llego nada del remote config');
            }
           
            
            // if(Object.keys(objeto).length !== 0)
            // console.log(JSON.parse(objeto['PICHINCHA_123456781920VA3131POJ8I']));
          }, data => reject());
      }).catch(()=>{
        reject();
      });

    });
    
  }


  setCurrentConfig(config: any){
    this.config = config;
    this.utilsService.changeFavicon(this.config.favicon);
    this.setCSSProperties();
  }

  setConfigAll(objeto: {[key: string] : string}){
      this.configAll = []
      for(var property in objeto){
          let object = JSON.parse(objeto[property]);
          object.code = property;
          this.configAll.push(object);
          
      }
      
  }

  setCSSProperties(){
    let root = document.getElementsByTagName('body')[0];
    root.style.setProperty('--primaryColor', this.config.primary_color);
    root.style.setProperty('--secondaryColor', this.config.secondary_color);

  }

}
