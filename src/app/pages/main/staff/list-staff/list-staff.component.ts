import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, getPage } from 'src/app/core/utils';
import { omitBy, isNil } from 'lodash';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-staff',
  templateUrl: './list-staff.component.html',
  styleUrls: ['./list-staff.component.scss']
})
export class ListStaffComponent implements OnInit {

  listClubs = [];
  listStaff = [];
  listRole = [];
  // filter
  clubId: number;
  roleId: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  total: number;
  selectedClub: number;
  searchValue: string;
  selectedRole: number;

  constructor(
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private shareSvc: ShareService,
    private employeeSvc: EmployeesService,
    private router: Router,

  ) { }

  async ngOnInit() {
    this.listClubs = await getDataSelect(this.shareSvc.getListClub());
    this.listRole = await getDataSelect(this.shareSvc.getListRole());
    this.getListStaff();
  }

  public getListStaff(options: Query = {}) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      roleId: this.roleId,
      queryString: this.searchValue,
      page: this.page,
      limit: this.pageSize
    };
    this.employeeSvc.getListStaff(omitBy(options, isNil))
      .subscribe((res: any) => {
        this.listStaff = res.data.result;
        this.total = res.data.total;
        this.pages = getPage(this.total, this.pageSize);
        this.spinner.hide();
      }, () => this.spinner.hide());
  }

  public onChangeClub(selectedClub: any) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.getListStaff();
    }
  }

  public onChangeRole(selectedRole: any) {
    if (![undefined, this.roleId].includes(selectedRole)) {
      this.roleId = selectedRole;
      this.getListStaff();
    }
  }


  public loadNext(page: number) {
    this.page = page;
    this.getListStaff();
  }

  public onSearch() {
    this.page = 1;
    this.getListStaff();
  }

  public viewDetail(employee: UserProfile, event: any) {
    const url = UrlConstant.ROUTE.MAIN.STAFF + `/${employee.accountId}`;
    return event.ctrlKey ? window.open(url, '_blank') : this.router.navigate([url]);
  }
}
