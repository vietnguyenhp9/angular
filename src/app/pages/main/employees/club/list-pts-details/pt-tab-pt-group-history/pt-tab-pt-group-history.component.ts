import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { getPage } from 'src/app/core/utils';
import { omitBy, isNil } from 'lodash';
@Component({
  selector: 'app-pt-tab-pt-group-history',
  templateUrl: './pt-tab-pt-group-history.component.html',
  styleUrls: ['./pt-tab-pt-group-history.component.scss']
})
export class PtTabPtGroupHistoryComponent implements OnInit {
  @Input() userId: string;
  ptHistoryGroup = [];
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
    this.getListPtHistory();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListPtHistory();
  }

  public getListPtHistory(options?: Query) {
    this.spinner.show();
    options = {
      page: this.page,
      limit: this.pageSize,
    };
    this.employeeSvc
      .getPtGroupHistory(this.userId, omitBy(options, isNil))
      .subscribe((res: any) => {
        this.total = res.data.total;
        this.pages = getPage(this.total, this.pageSize);
        this.ptHistoryGroup = res.data.result;
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

}
