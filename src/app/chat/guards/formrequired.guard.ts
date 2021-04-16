import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute, ParamMap } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
//import { RemoteConfigService } from '../services/remote-config.service';
import { LocalConfigService } from '../services/local-config.service';


@Injectable()
export class FormRequiredGuard implements CanActivate {
  constructor(public router: Router, 
    public utilService: UtilsService,
    //public remoteConfigService: RemoteConfigService,
    public localConfigService: LocalConfigService,
    public activatedRoute: ActivatedRoute) {}
 
  canActivate(): Promise<boolean> {
    console.log('can activate form');
    return new Promise<boolean>((resolve, reject)=>{
      // let data = this.localConfigService.syncParameters();
      // console.log(data);
      // console.log('show customer', (data as any).show_customer_form );
      // if(!(data as any).show_customer_form ){
      //   let params: any= {};
      //   let id_session = this.utilService.getParamValueQueryString('id_session');
      //   params.code = this.utilService.getParamValueQueryString('code');
      //   if(id_session != ''){
      //     params.id_session = id_session;
      //   }
      //   this.router.navigate(['/chat'], {queryParams : params});
      // }
      return resolve(true);
    });
  }

}