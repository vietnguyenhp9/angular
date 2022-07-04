import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { hyperLinkMember } from 'src/app/core/utils';

@Component({
  selector: 'app-form-pt-calendar-booking-detail',
  templateUrl: './form-pt-calendar-booking-detail.component.html',
  styleUrls: ['./form-pt-calendar-booking-detail.component.scss']
})
export class FormPtCalendarBookingDetailComponent implements OnInit {
  @Input() ptCalendarBooking: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  // 
  listCustomerOfPT = [];
  dateFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  timeHeader: string;

  constructor(
    private activeModal: NgbActiveModal,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.listCustomerOfPT = this.ptCalendarBooking;
    this.timeHeader = this.ptCalendarBooking[0].startDate;
  }


  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

  public hyperLinkMember(accountId: string) {
    hyperLinkMember(accountId);
  }

}
