import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { omitBy, isNil } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { getPage, hyperLinkMember } from 'src/app/core/utils';

@Component({
  selector: 'app-pt-tab-pt-contract',
  templateUrl: './pt-tab-pt-contract.component.html',
  styleUrls: ['./pt-tab-pt-contract.component.scss']
})
export class PtTabPtContractComponent implements OnInit {
  @Input() userId: string;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // 
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  listPtContracts = [];
  constructor(
    private employeesSvc: EmployeesService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getListPTContracts();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListPTContracts();
  }

  public getListPTContracts(options?: Query) {
    this.spinner.show();
    options = {
      page: this.page,
      limit: this.pageSize,
    };
    this.employeesSvc.getListPTContracts(this.userId, omitBy(options, isNil)).subscribe((res: any) => {
      this.total = res.data.total;
      this.pages = getPage(this.total, this.pageSize);
      this.listPtContracts = res.data.result.map(item => ({
        ...item,
        classMember: SystemConstant.CLASS_STATUS[item.status],
        tranferStatus: item.isTransferred == "1" ? '<i class="font-size-24  fas fa-check text-success"></i>' : "<span> - </span>"
      }));
      this.spinner.hide();
    }, () => this.spinner.hide());
  }


  public hyperLinkMemberCustomer(accountId: string) {
    hyperLinkMember(accountId);
  }
}
