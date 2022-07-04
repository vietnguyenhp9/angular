import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-add-pt',
  templateUrl: './form-add-pt.component.html',
  styleUrls: ['./form-add-pt.component.scss']
})
export class FormAddPtComponent {
  @Input() listPT: any;
  @Input() title: any;
  @Input() type: any;
  @Output() ptId: EventEmitter<string> = new EventEmitter();
  constructor(
    private activeModal: NgbActiveModal,
    public translate: TranslateService
  ) { }

  public onSubmit(ptId: string) {
    this.ptId.emit(ptId);
    this.activeModal.dismiss();
  }

  public onClose() {
    this.activeModal.dismiss();
  }

}
