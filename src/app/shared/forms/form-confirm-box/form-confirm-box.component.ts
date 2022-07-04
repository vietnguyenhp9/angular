import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-confirm-box',
  templateUrl: './form-confirm-box.component.html',
  styleUrls: ['./form-confirm-box.component.scss']
})
export class FormConfirmBoxComponent {
  @Input() title: string;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  constructor(
    private activeModal: NgbActiveModal,
    public translate: TranslateService
  ) { }

  public onSubmit() {
    this.closeModal.emit(true);
    this.activeModal.dismiss();
  }

  public onCancel() {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }
}
