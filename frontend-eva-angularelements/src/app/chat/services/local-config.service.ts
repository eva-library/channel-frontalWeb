/**
 * This file replace the remote-config.service.ts file to operate the frontend without Firebase
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { botslist } from '../../../environments/environment'
// import entire SDK
import AWS from 'aws-sdk';
// import AWS object without services
import AWSG from 'aws-sdk/global';
// import individual service
import S3 from 'aws-sdk/clients/s3';
const awsParamStore = require( 'aws-param-store' );
@Injectable({
  providedIn: 'root'
})
export class LocalConfigService {

  appcode = '';
  attemptCount = 0;
  config: any = null;
  configAll: any = null;
  allowUrl = false;

  constructor(
    public router: Router,
    public utilsService: UtilsService,
  ) {
    this.appcode = utilsService.getParamValueQueryString('code');
    // this.syncParameters();
    this.syncParametersAWS().then();
  }

  syncParametersAWS(): Promise<any> {
    return new Promise((resolve, reject)=>{
      if(this.config != null) resolve(this.config);
      AWS.config.region = 'Input_config_region';
      let cred1 = 'Input_AccessKeyId';
      let cred2 = 'Input_AWSSecretKey';
      AWS.config.credentials = new AWS.Credentials( cred1 , cred2 );
      awsParamStore.getParameter( 'Input_path_apikeydata', { region: 'Input_config_region' } )
      .then( (parameter) => {
          // Parameter info object for '/project1/my-parameter'
          let parameterForm = JSON.parse(parameter.Value);
          this.setConfigAll(parameterForm);
          this.setCurrentConfig(parameterForm['Input_key_ref'])               
          if( parameterForm['Input_key_ref'].domain.indexOf(window.location.origin) > -1 ) {
            this.allowUrl = true;
          }

          resolve(this.config);
      }).catch((error)=>{
        reject();
      });;
    });

  }

  syncParameters(): object {

    if(this.config !== null){
      return this.config;
    }

    if (Object.keys(botslist).length !== 0) {
      this.setConfigAll(botslist);
      if(this.appcode !== ''){
        this.setCurrentConfig(botslist[this.appcode]);
      }
      return this.config;
    }
    else {
    }

  }

  setCurrentConfig(config: any){
    this.config = config;
    this.utilsService.changeFavicon(this.config.favicon);
    this.setCSSProperties();
  }

  setConfigAll(objeto){
      this.configAll = []
      for(var property in objeto){
          let object = objeto[property];
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
