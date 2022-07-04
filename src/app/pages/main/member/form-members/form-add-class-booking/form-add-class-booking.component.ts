import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { groupBy, sortBy } from 'lodash';
import * as  moment from 'moment';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { MemberService } from 'src/app/core/services/member/member.service';

@Component({
  selector: 'app-form-add-class-booking',
  templateUrl: './form-add-class-booking.component.html',
  styleUrls: ['./form-add-class-booking.component.scss']
})
export class FormAddClassBookingComponent implements OnInit {
  @Input() userId: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  // 
  listClassForBooking = [];

  constructor(
    private memberSvc: MemberService,
    // private activeModal: NgbActiveModal,
    // private alert: ToastrService,
    // private spinner: NgxSpinner
  ) { }

  ngOnInit(): void {
    this._getListClassForBooking();
  }

  private _getListClassForBooking() {
    this.memberSvc.getListClassForBooking(this.userId).subscribe((res: any) => {
      // Group Class By Day
      const groupClassByDate = groupBy(res.data, item => moment(item.beginningDateTime).format(SystemConstant.TIME_FORMAT.DD));
      this.listClassForBooking = sortBy(groupClassByDate, item => moment(item.beginningDateTime).format(SystemConstant.TIME_FORMAT.HH_MM_SS));
      // console.log('this.listClassForBooking : ', this.listClassForBooking);
    });
  }
}
