import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  constructor(public sanitizer:DomSanitizer) { }

  /**
   * Retorna un string con la hora actual en formato de 24 horas.
   *
   * @returns Hora actual en HH:MM
   */
  setMessageTime() {
    const d = new Date();
    return `${d.getHours()}:${(d.getMinutes() < 10) ? '0' + d.getMinutes() : d.getMinutes()}`;
  }

  /**
   * Retorna un string con la unicial de cada palabra en mayúscula y el resto en minúscula.
   *
   * @param name nombre al que de le desea dar formato.
   * @returns string formateado.
   */
  formatName(name: string) {
    const nameAsList = name.split(/\s+/);
    name = '';
    for (let part of nameAsList) {
      part = part.trim();
      part = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      name = name === '' ? part : `${name} ${part}`;
    }
    return name;
  }

  /**
   * Crea una copia de un objeto JSON.
   *
   * @param objetc Objeto JSON del cual se creará la copia.
   */
  jsonCopy(objetc: any) {
    return JSON.parse(JSON.stringify(objetc));
  }

  /**
   * Elimina los signos de un texto.
   *
   * @param text Texto que se desea limpiar.
   * @returns Retorna el texto sin símbolos.
   */
  cleanText(text: string) {
    return text.replace(/[\¿\?\¡\!\.\,\+\*\/\=\_\"\º\#\$\%\&\'\´\(\)\:\;\[\]\{\}\¨\`\^\·\º\ª\<\>]+/g, '');
  }

  getParamValueQueryString(paramName) {
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    if (!paramValue) {
      paramValue = ''; // por defecto se deja Colombia
    }
    return paramValue;
  }

  validateHasParamsUrl(url, paramName) {
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    if (!paramValue) {
      return false;
    }
    return true;
  }

  /**
   * Elimina las etiquetas de marcado.
   *
   * @param text Texto que se desea limpiar.
   * @returns Retorna el texto recibido sin etiquetas de marcado.
   */
  removeTags(text: string) {
    return text.replace(/<[^>]*>/g, '');
  }

  changeFavicon(favicon: string) {
    var link;
      link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
  };


  playAudio(){
    let audio = new Audio();
    audio.src = "/assets/chat2.mp3";
    audio.load();
    audio.play();
  }



}
