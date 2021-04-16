import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss']
})
export class ModalImageComponent {

  @Input() backgroundWhite:any;
  @Input() urlImage: any;
  @Output() action: EventEmitter<any> = new EventEmitter();

  constructor() { }

  active() {
    this.action.emit();
  }
}
