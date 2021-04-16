import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UIService {

  /**
   * Variable que indica si el agente está escribiendo o si el bot está procesando.
   *
   */
  writing: boolean;

  /**
   * Variable que bloquea la caja de texto del chat.
   *
   */
  disableInput: boolean;

  /**
   * Varible que indica si el bot o el agente están conectados.
   *
   */
  conected: boolean;

  constructor() { }

  /**
   * Tras 200 milisegundos realiza un desplazamiento hasta la parte inferior del elemento que se le pasa como parámetro.
   *
   * @param element Elemento en el que se hará un desplazamiento hasta la parte inderior.
   */
  scrollToBottom(element: ElementRef) {
    setTimeout(() => {
      try {
        element.nativeElement.scrollTop = element.nativeElement.scrollHeight;
      } catch (err) { }
    }, 200);
  }
}
