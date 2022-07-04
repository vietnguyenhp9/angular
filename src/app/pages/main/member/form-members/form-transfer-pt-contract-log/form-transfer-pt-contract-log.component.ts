import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { MemberService } from 'src/app/core/services/member/member.service';

@Component({
  selector: 'app-form-transfer-pt-contract-log',
  templateUrl: './form-transfer-pt-contract-log.component.html',
  styleUrls: ['./form-transfer-pt-contract-log.component.scss']
})
export class FormTransferPtContractLogComponent implements OnInit {

  @Input() title:any;
  @Input() ptContractId: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private memberSvc: MemberService,
    public translate: TranslateService
  ) { }

  // data
  listPTContractLog = [];
  dateFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;

  ngOnInit() {
    this._getListPtContractLog();
  }

  private _getListPtContractLog() {
    this.spinner.show();
    this.memberSvc.getListPTContractLog(this.ptContractId)
      .subscribe((res: any) => {
        this.listPTContractLog = res.data.result;
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }
}
