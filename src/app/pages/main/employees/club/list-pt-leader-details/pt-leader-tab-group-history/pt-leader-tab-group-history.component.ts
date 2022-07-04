import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { omitBy, isNil } from 'lodash';
import { getPage } from 'src/app/core/utils';
@Component({
  selector: 'app-pt-leader-tab-group-history',
  templateUrl: './pt-leader-tab-group-history.component.html',
  styleUrls: ['./pt-leader-tab-group-history.component.scss']
})
export class PtLeaderTabGroupHistoryComponent implements OnInit {
  @Input() userId: string;
  // 
  ptLeaderHistoryGroup = [];
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;

  constructor(
    private spinner: NgxSpinnerService,
    private employeeSvc: EmployeesService
  ) { }

  ngOnInit(): void {
    this.getPtLeaderHistory();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getPtLeaderHistory();
  }

  public getPtLeaderHistory(options?: Query) {
    this.spinner.show();
    options = {
      page: this.page,
      limit: this.pageSize,
    };
    this.employeeSvc
      .getPtLeaderHistoryGroupById(this.userId, omitBy(options, isNil))
      .subscribe((res: any) => {
        this.total = res.data.total;
        this.pages = getPage(this.total, this.pageSize);
        this.ptLeaderHistoryGroup = res.data.result;
        this.spinner.hide();
      }, () => this.spinner.hide());
  }
}
