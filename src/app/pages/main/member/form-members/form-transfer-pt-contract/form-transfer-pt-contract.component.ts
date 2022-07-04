import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/core/services/common/error.service';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect } from 'src/app/core/utils';

@Component({
  selector: 'app-form-transfer-pt-contract',
  templateUrl: './form-transfer-pt-contract.component.html',
  styleUrls: ['./form-transfer-pt-contract.component.scss']
})
export class FormTransferPtContractComponent implements OnInit {
  @Input() itemContract: any;
  @Input() title: string;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();
  // 
  form: FormGroup;
  listPT = [];


  constructor(
    private activeModal: NgbActiveModal,
    public translate: TranslateService,
    private fb: FormBuilder,
    private alert: ToastrService,
    private shareSvc: ShareService,
    private employeesSvc: EmployeesService,
    private errorSvc: ErrorService
  ) { }

  async ngOnInit() {
    this._createForm();
    this.listPT = await getDataSelect(this.shareSvc.getListPtByClub(this.itemContract.clubId));
  }

  private _createForm() {
    this.form = this.fb.group({
      ptId: [null, Validators.required],
    });
    this.form.patchValue({
      ptId: this.itemContract.ptInfoId,
    });
  }

  public onSubmit() {
    this.closeModal.emit(true);
    this.activeModal.dismiss();
    const body = {
      contractId: this.itemContract.id,
      ptId: this.itemContract.ptInfoId,
      transferPtId: this.form.controls.ptId.value,
    };
    this.employeesSvc.transferPT(body).subscribe(
      () => {
        this.activeModal.dismiss();
        this.closeModal.emit(true);
        this.alert.success(this.translate.instant('FORM.TRANSFER_PT_SUCCESS'));
      }, (err) => {
        this.alert.error(this.errorSvc.getServerErrorMessage(err));
      }
    );
  }

  public onCancel() {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

}
