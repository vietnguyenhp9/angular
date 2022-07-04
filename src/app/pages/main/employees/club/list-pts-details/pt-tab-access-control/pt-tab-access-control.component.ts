import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { getPage } from 'src/app/core/utils';

@Component({
  selector: 'app-pt-tab-access-control',
  templateUrl: './pt-tab-access-control.component.html',
  styleUrls: ['./pt-tab-access-control.component.scss'],
})
export class PtTabAccessControlComponent implements OnInit {
  @Input() userId: string;
  listPTAccessLog = [];
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
    private employeesSvc: EmployeesService,
    public translate: TranslateService,
  ) { }

  async ngOnInit() {
    this.getListPTAccessLog();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListPTAccessLog();
  }


  public getListPTAccessLog(options?: Query) {
    this.spinner.show();
    options = {
      page: this.page,
      limit: this.pageSize,
    };
    this.employeesSvc.getListPTAccessLog(this.userId, omitBy(options, isNil)).subscribe((res: any) => {
      this.total = res.data.total;
      this.pages = getPage(this.total, this.pageSize);
      this.listPTAccessLog = res.data.result.map((item: any) => {
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
