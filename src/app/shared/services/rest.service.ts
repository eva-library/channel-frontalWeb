import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Método que realiza una petición POST y devuelve un observable.
   *
   * @param url URL a la que se hará la petición.
   * @param body Cuerpo de la petición.
   * @param options Opciones HTTP de la petición.
   */
  postRequest(url: string, body: any, options: any): Observable<any> {
    return this.httpClient.post(url, body, options);
  }

  /**
   * Método que realiza una petición PRE.
   * @param url URL a la que se hará la petición.
   */
  getRequest(url: string): any {
    return this.httpClient.get(url);
  }
}
