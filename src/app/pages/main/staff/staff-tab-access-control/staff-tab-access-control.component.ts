import { Component, Input, OnInit } from '@angular/core';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { isNil, omitBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { MemberService } from 'src/app/core/services/member/member.service';
import { TranslateService } from '@ngx-translate/core';
import { getPage } from 'src/app/core/utils';
import * as moment from 'moment';

@Component({
  selector: 'app-staff-tab-access-control',
  templateUrl: './staff-tab-access-control.component.html',
  styleUrls: ['./staff-tab-access-control.component.scss']
})
export class StaffTabAccessControlComponent implements OnInit {
  @Input() userId: string;
  listAccessStaffLog = [];
  timeFormat = SystemConstant.TIME_FORMAT;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // Club zone scan
  type = {
    1: 'VisitClub',
    2: 'ClubZoneScan'
  };

  constructor(
    private spinner: NgxSpinnerService,
    private memberSvc: MemberService,
    public translate: TranslateService
  ) { }

  async ngOnInit() {
    this.getListStaffAccessLog();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListStaffAccessLog();
  }

  public resetPages() {
    this.page = 1;
    this.getListStaffAccessLog();
  }
  public getListStaffAccessLog(options?: Query) {
    this.spinner.show();
    options = {
      page: this.page,
      limit: this.pageSize,
    };
    this.memberSvc.getListMemberAccessLog(this.userId, omitBy(options, isNil)).subscribe((res: any) => {
      this.total = res.data.total;
      this.pages = getPage(this.total, this.pageSize);
      this.listAccessStaffLog = res.data.result.map((item: any) => {
        const duration = moment.duration(
          moment(item.dateOut).diff(moment(item.dateIn)))
          .asHours();
        // Map duration times
        item.duration = moment.utc(duration * 3600 * 1000).format('HH [hours] mm [minutes]');
        item.zone = item.studioId ? this.translate.instant('STUDIO') : this.translate.instant('CLUB');
        return item;
      });
      this.spinner.hide();
    }, () => this.spinner.hide());
  }
}
