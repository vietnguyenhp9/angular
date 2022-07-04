import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { MemberService } from 'src/app/core/services/member/member.service';

@Component({
  selector: 'app-form-class-booking-detail',
  templateUrl: './form-class-booking-detail.component.html',
  styleUrls: ['./form-class-booking-detail.component.scss'],
})
export class FormClassBookingDetailComponent implements OnInit, AfterViewInit {
  @Input() detailBooking: any;
  @Input() type: any;
  @Input() accountId: string;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  //
  memberClassDetail: any;
  ptClassDetail: any;
  dateFormat = SystemConstant.TIME_FORMAT.DATE_FORM;
  isEditClassBooking: boolean = false;
  listStatus = [
    SystemConstant.STATUS.ABSENT,
    SystemConstant.STATUS.PRACTICED,
    SystemConstant.STATUS.BOOKED,
    SystemConstant.STATUS.CANCELED,
  ];
  selectedStatus: string;
  bookDate: string;
  bookTime: string;

  constructor(
    public translate: TranslateService,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    private memberSvc: MemberService
  ) {}

  ngOnInit(): void {
    return this.type === 'CLASSBOOKING'
      ? this._mapDataMemberClassDetail()
      : this._mapDataPtClassDetail();
  }

  ngAfterViewInit(): void {
    this._setClassReadOnlySelectBox('#eff2f7');
  }

  private _setClassReadOnlySelectBox(color: string) {
    const selectBoxStatus = document.getElementById('class-status');
    const ngSelect: any = selectBoxStatus.querySelector('.ng-select-container');
    ngSelect.style.setProperty('background-color', `${color}`, 'important');
  }

  public onEditClassBooking() {
    this.isEditClassBooking = true;
    this._setClassReadOnlySelectBox('#ffff');
  }

  public onChangeEditStatus(selectedStatus: any) {
    this.selectedStatus = selectedStatus;
  }

  public onChangeTime(time: string, type: string) {
    const _type = {
      date: () => {
        this.bookDate = time;
      },
      time: () => {
        this.bookTime = time;
      },
    };
    return _type[type]();
  }

  public onSubmitClassBooking() {
    this.spinner.show();
    const bookDate = this.bookDate
      ? this.bookDate
      : this.memberClassDetail.bookDate;
    const bookTime = this.bookTime
      ? this.bookTime
      : this.memberClassDetail.bookTime;
    const body = {
      status: this.selectedStatus
        ? this.selectedStatus
        : this.memberClassDetail.status,
      classBookingId: this.memberClassDetail.classBookingId,
      createdAt: bookDate + ' ' + bookTime,
    };
    this.memberSvc.editClassBookignDetail(this.accountId, body).subscribe(
      (res: any) => {
        if (res) {
          this.activeModal.dismiss();
          this.closeModal.emit(true);
          this.alert.success(this.translate.instant('FORM.UPDATE_SUCCESS'));
        }
      },
      () => this.spinner.hide()
    );
    this.spinner.hide();
  }

  private _mapDataMemberClassDetail() {
    const _classBooking = this.detailBooking.event._def.extendedProps.data;
    this.memberClassDetail = {
      id: _classBooking.id,
      status: _classBooking.status,
      startTime: moment(_classBooking.beginningDateTime).format(
        SystemConstant.TIME_FORMAT.HH_MM_SS
      ),
      finishTime: moment(_classBooking.beginningDateTime)
        .add(_classBooking.durationInMins, 'minutes')
        .format(SystemConstant.TIME_FORMAT.HH_MM_SS),
      bookDate: moment(_classBooking.createdAt).format(
        SystemConstant.TIME_FORMAT.YY_MM_DD
      ),
      bookTime: moment(_classBooking.createdAt).format(
        SystemConstant.TIME_FORMAT.HH_MM_SS
      ),
      classBookingId: _classBooking.classBookingId,
      bookedMember: _classBooking.bookedMember,
      maxiumNumberOfMember: _classBooking.maxiumNumberOfMember,
      maxiumReserveMember: _classBooking.maxiumReserveMember,
      reservedMember: _classBooking.reservedMember,
      clubNameEn: _classBooking.clubNameEn,
      clubNameVi: _classBooking.clubNameVi,
    };
  }

  private _mapDataPtClassDetail() {
    const _ptBooking = this.detailBooking.event._def.extendedProps.data;
    this.ptClassDetail = {
      status: _ptBooking.status,
      startDate: _ptBooking.startDate,
      endDate: _ptBooking.endDate,
      clubNameEn: _ptBooking.clubNameEn,
      clubNameVi: _ptBooking.clubNameVi,
      ptName: _ptBooking.ptName,
      ptPackageNameEn: _ptBooking.ptPackageNameEn,
      ptPackageNameVn: _ptBooking.ptPackageNameVn,
      ptContractId: _ptBooking.ptContractId,
    };
  }

  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }
}
