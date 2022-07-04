import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { ClassService } from 'src/app/core/services/class/class.service';
import { hyperLinkMember } from 'src/app/core/utils';
import { FormConfirmBoxComponent } from 'src/app/shared/forms/form-confirm-box/form-confirm-box.component';
import { FormScheduleClassComponent } from '../form-schedule-class/form-schedule-class.component';

@Component({
  selector: 'app-form-class-calendar-detail',
  templateUrl: './form-class-calendar-detail.component.html',
  styleUrls: ['./form-class-calendar-detail.component.scss']
})
export class FormClassCalendarDetailComponent implements OnInit {
  @Input() classBookingDetail: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  // 
  listClassBooking = [];
  dateFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  titleHeader: string;

  constructor(
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private classSvc: ClassService,
    private activeModal: NgbActiveModal,
    private modalSvc: NgbModal,
    private alert: ToastrService
  ) { }

  ngOnInit(): void {
    this._getListClassBooking();
    const start = moment(this.classBookingDetail.beginningDateTime)
      .format(SystemConstant.TIME_FORMAT.HH_MM);
    const end = moment(this.classBookingDetail.beginningDateTime).add(this.classBookingDetail.durationInMins, 'minutes')
      .format(SystemConstant.TIME_FORMAT.HH_MM);
    this.titleHeader = start + ' - ' + end;
  }

  private _getListClassBooking() {
    this.spinner.show();
    this.classSvc.getListClassBookingByClassId(this.classBookingDetail.idBook).subscribe((res: any) => {
      this.listClassBooking = res.data;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  private _deleteClassBooking(idBook: string) {
    this.spinner.show();
    this.classSvc.deleteClassBooking(idBook).subscribe((res: any) => {
      if (res) {
        this.closeModal.emit(true);
        this.activeModal.dismiss();
        this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
        this.spinner.hide();
      }
    }, () => this.spinner.hide());
  }

  public onClose(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

  public onDelete(idBook: string) {
    const modalRef = this.modalSvc.open(
      FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.CONFIRM_DELETE_CLASS';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deleteClassBooking(idBook) : {};
    });
  }

  public onEdit() {
    const modalRef = this.modalSvc.open(
      FormScheduleClassComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.EDIT_SCHEDULE_CLASS';
    modalRef.componentInstance.idBook = this.classBookingDetail.idBook;
    modalRef.componentInstance.action = SystemConstant.ACTION.EDIT;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.closeModal.emit(true) : {};
    });
  }

  public hyperLinkCustomer(accountId: string) {
    hyperLinkMember(accountId);
  }
}
