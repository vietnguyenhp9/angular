import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, getPage } from 'src/app/core/utils';
import { FormAddEmployeeComponent } from '../../form-club/form-add-employee/form-add-employee.component';


@Component({
  selector: 'app-list-gm',
  templateUrl: './list-gm.component.html',
  styleUrls: ['./list-gm.component.scss']
})
export class ListGmComponent implements OnInit {
  // List
  listClub: Club[] = [];
  listGm = [];
  // Filter
  selectedClub: number;
  isDisableSelected: boolean;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // Query
  searchValue = '';
  clubId: number;

  constructor(
    private shareSvc: ShareService,
    private spinner: NgxSpinnerService,
    private employeesSvc: EmployeesService,
    public translate: TranslateService,
    private authSvc: AuthenticationService,
    private modalSvc: NgbModal,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.listClub = await getDataSelect(this.shareSvc.getListClub());
    this._getDataByRole();
  }

  private _getDataByRole() {
    const userInfo = this.authSvc.getUserProfileLocal();
    if (userInfo.clubId) {
      this.clubId = userInfo.clubId;
      this.selectedClub = userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
    }
    this.getListGm();
  }

  public onSearch() {
    this.page = 1;
    this.getListGm();
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.page = 1;
      this.getListGm();
    }
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListGm();
  }

  public addNewGM() {
    const modalRef = this.modalSvc.open(
      FormAddEmployeeComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.accountType = 'GM';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res? this.getListGm():{};
    });
  }

  public getListGm(options?: Query) {
    this.spinner.show();
    options = {
      queryString: this.searchValue,
      clubId: this.clubId,
      page: this.page,
      limit: this.pageSize,
    };
    this.employeesSvc.getListGm(omitBy(options, isNil)).subscribe((res: any) => {
      this.total = res.data.total;
      this.pages = getPage(this.total, this.pageSize);
      this.listGm = res.data.result;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  public viewDetail(gm: UserProfile, event) {
    const url = UrlConstant.ROUTE.MAIN.EMPLOYEES_LIST_GM + `/${gm.accountId}`;
    sessionStorage.setItem('gmId', gm.gmId);
    return event.ctrlKey ? window.open(url, '_blank') : this.router.navigate([url]);
  }
}
