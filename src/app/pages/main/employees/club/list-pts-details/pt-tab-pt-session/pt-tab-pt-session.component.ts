import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { omitBy, isNil } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { getPage } from 'src/app/core/utils';

@Component({
  selector: 'app-pt-tab-pt-session',
  templateUrl: './pt-tab-pt-session.component.html',
  styleUrls: ['./pt-tab-pt-session.component.scss']
})
export class PtTabPtSessionComponent implements OnInit {

  @Input() userId: string;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // 
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  listPtSessions = [];
  constructor(
    private employeesSvc: EmployeesService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getListPTSession();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListPTSession();
  }

  public getListPTSession(options?: Query) {
    this.spinner.show();
    options = {
      page: this.page,
      limit: this.pageSize,
    };
    this.employeesSvc.getListPTSession(this.userId, omitBy(options, isNil)).subscribe((res: any) => {
      this.total = res.data.total;
      this.pages = getPage(this.total, this.pageSize);
      this.listPtSessions = res.data.result;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

}
