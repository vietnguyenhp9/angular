import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { ClassService } from 'src/app/core/services/class/class.service';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, getPage } from 'src/app/core/utils';

@Component({
  selector: 'app-list-class-booking',
  templateUrl: './list-class-booking.component.html',
  styleUrls: ['./list-class-booking.component.scss']
})
export class ListClassBookingComponent implements OnInit {
  listClassBooking = [];
  listClub = [];
  listClass = [];
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  // Filter
  selectedClub: number;
  selectedClass: number;
  isDisableSelected: boolean;
  selectedDateTime: {
    startDate: moment.Moment;
    endDate: moment.Moment;
  };
  startDate: moment.Moment;
  endDate: moment.Moment;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  dateLimit = SystemConstant.DATE_RANGE.DATE_LIMIT;
  // Query
  searchValue = '';
  clubId: number;
  classId: number;
  constructor(
    private spinner: NgxSpinnerService,
    private classSvc: ClassService,
    private authSvc: AuthenticationService,
    public translate: TranslateService,
    private shareSvc: ShareService
  ) {
    this.startDate = moment().startOf('day');
    this.endDate = moment().endOf('day');
    this.selectedDateTime = {
      startDate: this.startDate,
      endDate: this.endDate
    };
  }

  async ngOnInit() {
    [this.listClub, this.listClass] = await Promise.all([
      getDataSelect(this.shareSvc.getListClub()),
      getDataSelect(this.classSvc.getListClass()),
    ]);
    this._getDataByRole();
  }

  private _getDataByRole() {
    const userInfo = this.authSvc.getUserProfileLocal();
    if (userInfo.clubId) {
      this.clubId = userInfo.clubId;
      this.selectedClub = userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
    }
    this.getListClassBooking();
  }

  public onFilterDateChange(event: any) {
    if (event.startDate && event.endDate) {
      this.page = 1;
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.getListClassBooking();
    }
  }

  public getListClassBooking(options?: Query) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      classId: this.classId,
      page: this.page,
      limit: this.pageSize,
      startDate: moment(this.startDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: moment(this.endDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
    };
    this.classSvc.getListClassBooking(omitBy(options, isNil)).subscribe((res: any) => {
      this.total = res.data.total;
      this.pages = getPage(this.total, this.pageSize);
      this.listClassBooking = res.data.result;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.page = 1;
      this.getListClassBooking();
    }
  }

  public onChangeClass(onChangeClass: number) {
    if (![undefined, this.classId].includes(onChangeClass)) {
      this.classId = onChangeClass;
      this.page = 1;
      this.getListClassBooking();
    }
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListClassBooking();
  }
}
