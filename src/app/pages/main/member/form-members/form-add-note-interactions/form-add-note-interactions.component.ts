import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from 'src/app/core/services/member/member.service';

@Component({
  selector: 'app-form-add-note-interactions',
  templateUrl: './form-add-note-interactions.component.html',
  styleUrls: ['./form-add-note-interactions.component.scss']
})
export class FormAddNoteInteractionsComponent implements OnInit {
  @Input() userId: string;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private alert: ToastrService,
    private activeModal: NgbActiveModal,
    private memberSvc: MemberService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this._createForm();
  }

  private _createForm() {
    this.form = this.fb.group({
      accountId: [this.userId, [Validators.required]],
      note: [null, [Validators.required]],
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.spinner.show();
      this.memberSvc.addNote(this.form.value)
        .subscribe(() => {
          this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
          this.spinner.hide();
        }, () => this.spinner.hide());
    }
    else {
      this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
    }
  }

  public onCancel() {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }
}
