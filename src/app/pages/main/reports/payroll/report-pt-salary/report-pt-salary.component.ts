import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { ReportPayrollService } from 'src/app/core/services/reports/report-payroll.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormAddBonusPtSalaryComponent } from '../form-payroll/form-add-bonus-pt-salary/form-add-bonus-pt-salary.component';
import { exportExcel, getDataSelect, getPage } from 'src/app/core/utils';

@Component({
  selector: 'app-report-pt-salary',
  templateUrl: './report-pt-salary.component.html',
  styleUrls: ['./report-pt-salary.component.scss']
})
export class ReportPtSalaryComponent implements OnInit {
  @Input() hyperLinkMemberPayroll: any;
  // Select box
  @Input() listClub: Club[];
  @Input() listMonth = [];
  @Input() listYear = [];
  @Input() userInfo: UserProfile;
  // Query
  selectedClub: number;
  selectedGroup: number;
  selectedPt: number;
  selectedMonth = moment().get('month') + 1;
  selectedYear = moment().get('year');
  isDisableSelected: boolean;
  ptId: number;
  clubId: number;
  ptGroupId: number;
  startDate: string;
  endDate: string;
  isExport = false;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // Fillter
  listGroup = [];
  listPt = [];
  // List
  listPtSalary = [];
  // Data
  totalBonus: number;
  totalRevenue: number;
  // Sort
  objSort: any = {};
  checkedRevAsc = false;
  checkedRevDesc = false;
  checkedSalaryAsc = false;
  checkedSalaryDesc = false;
  checkedOtherBonusAsc = false;
  checkedOtherBonusDesc = false;
  checkedTotalSalaryAsc = false;
  checkedTotalSalaryDesc = false;
  checkedPitAsc = false;
  checkedPitDesc = false;
  checkedActualSalaryAsc = false;
  checkedActualSalaryDesc = false;

  constructor(
    private reportPayrollSvc: ReportPayrollService,
    private shareSvc: ShareService,
    public translate: TranslateService,
    private modalSvc: NgbModal,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  async ngOnInit() {
    this._getDataByRole();
  }

  private _getDataByRole() {
    if (this.userInfo.clubId) {
      this.clubId = this.userInfo.clubId;
      this.selectedClub = this.userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
      this.getListGroupSelect(this.selectedClub);
    }
    this.getListPtSalary();
  }

  public async getListGroupSelect(clubId: number) {
    this.listGroup = await getDataSelect(this.shareSvc.getListGroupByClub(clubId));
  }

  public async getListPtSelect(groupId: number) {
    this.listPt = await getDataSelect(this.shareSvc.getListPTByGroup(groupId));
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.selectedGroup = this.selectedPt = null;
      this.ptGroupId = this.ptId = null;
      this.listGroup = this.listPt = [];
      if (selectedClub !== null) {
        this.getListGroupSelect(selectedClub);
      }
      this.getListPtSalary();
    }
  }

  public onChangeGroup(selectedGroup: number) {
    if (![undefined, null, this.ptGroupId].includes(selectedGroup)) {
      this.ptGroupId = selectedGroup;
      this.ptId = this.selectedPt = null;
      this.listPt = [];
      this.getListPtSelect(selectedGroup);
      this.getListPtSalary();
    }
  }

  public onChangePt(selectedPt: number) {
    if (![undefined, this.ptId].includes(selectedPt)) {
      this.ptId = selectedPt;
      this.getListPtSalary();
    }
  }

  public onChangeMonth(month: number) {
    if (![undefined, this.month].includes(month)) {
      this.month = month;
      this.page = 1;
      this.getListPtSalary();
    }
  }

  public onChangeYear(year: number) {
    if (![undefined, this.year].includes(year)) {
      this.year = year;
      this.page = 1;
      this.getListPtSalary();
    }
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListPtSalary();
  }

  // Delete Key Sort 
  public deleteKeySort(key) {
    delete this.objSort[key];
  }

  // Add Key Sort
  public addKeySort(key, type) {
    if (!key || !type) {
      return;
    }
    this.objSort = Object.assign(this.objSort, {
      [key]: type,
    });
  }

  // Sort Revenue And Salary
  public sortData(keySort: string) {
    const [key, type] = (keySort || '').split("_");
    const checkSort = {
      revenue_asc: () => {
        this.checkedRevAsc = !this.checkedRevAsc;
        this.checkedRevDesc = this.checkedRevAsc && false;
        !this.checkedRevAsc
          ? this.deleteKeySort('revenue')
          : this.addKeySort(key, type);
      },
      revenue_desc: () => {
        this.checkedRevDesc = !this.checkedRevDesc;
        this.checkedRevAsc = this.checkedRevAsc && false;
        !this.checkedRevDesc
          ? this.deleteKeySort('revenue')
          : this.addKeySort(key, type);
      },
      salary_asc: () => {
        this.checkedSalaryAsc = !this.checkedSalaryAsc;
        this.checkedSalaryDesc = this.checkedSalaryAsc && false;
        !this.checkedSalaryAsc
          ? this.deleteKeySort('salary')
          : this.addKeySort(key, type);
      },
      salary_desc: () => {
        this.checkedSalaryDesc = !this.checkedSalaryDesc;
        this.checkedSalaryAsc = this.checkedSalaryDesc && false;
        !this.checkedSalaryDesc
          ? this.deleteKeySort('salary')
          : this.addKeySort(key, type);
      },
      otherBonus_asc: () => {
        this.checkedOtherBonusAsc = !this.checkedOtherBonusAsc;
        this.checkedOtherBonusDesc = this.checkedOtherBonusAsc && false;
        !this.checkedOtherBonusAsc
          ? this.deleteKeySort('otherBonus')
          : this.addKeySort(key, type);
      },
      otherBonus_desc: () => {
        this.checkedOtherBonusDesc = !this.checkedOtherBonusDesc;
        this.checkedOtherBonusAsc = this.checkedOtherBonusDesc && false;
        !this.checkedOtherBonusDesc
          ? this.deleteKeySort('otherBonus')
          : this.addKeySort(key, type);
      },

      totalSalary_asc: () => {
        this.checkedTotalSalaryAsc = !this.checkedTotalSalaryAsc;
        this.checkedTotalSalaryDesc = this.checkedTotalSalaryAsc && false;
        !this.checkedTotalSalaryAsc
          ? this.deleteKeySort('totalSalary')
          : this.addKeySort(key, type);
      },
      totalSalary_desc: () => {
        this.checkedTotalSalaryDesc = !this.checkedTotalSalaryDesc;
        this.checkedTotalSalaryAsc = this.checkedTotalSalaryDesc && false;
        !this.checkedTotalSalaryDesc
          ? this.deleteKeySort('totalSalary')
          : this.addKeySort(key, type);
      },

      pitAmount_asc: () => {
        this.checkedPitAsc = !this.checkedPitAsc;
        this.checkedPitDesc = this.checkedPitAsc && false;
        !this.checkedPitAsc
          ? this.deleteKeySort('pitAmount')
          : this.addKeySort(key, type);
      },
      pitAmount_desc: () => {
        this.checkedPitDesc = !this.checkedPitDesc;
        this.checkedPitAsc = this.checkedPitDesc && false;
        !this.checkedPitDesc
          ? this.deleteKeySort('pitAmount')
          : this.addKeySort(key, type);
      },

      actualSalary_asc: () => {
        this.checkedActualSalaryAsc = !this.checkedActualSalaryAsc;
        this.checkedActualSalaryDesc = this.checkedActualSalaryAsc && false;
        !this.checkedActualSalaryAsc
          ? this.deleteKeySort('actualSalary')
          : this.addKeySort(key, type);
      },
      actualSalary_desc: () => {
        this.checkedActualSalaryDesc = !this.checkedActualSalaryDesc;
        this.checkedActualSalaryAsc = this.checkedActualSalaryDesc && false;
        !this.checkedActualSalaryDesc
          ? this.deleteKeySort('actualSalary')
          : this.addKeySort(key, type);
      },
    };
    checkSort[keySort]();
    this.page = 1;
    this.getListPtSalary();
  }

  public viewDetail(pt: any, event) {
    if (event.ctrlKey) {
      const url = `/reports/payroll/pt-detail/${pt.ptId}?month=${this.month}&year=${this.year}`;
      window.open(url, '_blank');
      return;
    }
    sessionStorage.setItem('ptName', pt.ptAccountId + ' - ' + pt.ptName);
    this.router.navigate([`/reports/payroll/pt-detail/${pt.ptId}`], {
      queryParams: {
        month: this.month,
        year: this.year,
      },
    });
  }

  public addPtBonus(pt: any) {
    const modalRef = this.modalSvc.open(FormAddBonusPtSalaryComponent, {
      centered: true,
      size: 'md',
    });
    const date = moment({ year: this.year, month: this.month - 1, day: 1 });
    const ptInfo = {
      ptId: pt.ptId,
      bonusAmount: pt.otherBonus,
      reason: pt.reasonBonus,
      startDate: date.startOf('month').format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: date.endOf('month').format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
    };
    modalRef.componentInstance.ptInfo = ptInfo;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListPtSalary() : {};
    });
  }

  public async getListPtSalary(options: Query = {}) {
    this.spinner.show();
    const date = moment({ year: this.year, month: this.month - 1, day: 1 });
    options = {
      ptId: this.ptId,
      clubId: this.clubId,
      ptGroupId: this.ptGroupId,
      startDate: date.startOf('month').format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: date.endOf('month').format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      orderKey: Object.keys(this.objSort).join(',') || null,
      orderType: Object.values(this.objSort).join(',') || null,
      page: this.page,
      limit: this.pageSize,
    };
    if (!this.isExport) {
      this.reportPayrollSvc.getListPtReportSalary(omitBy(options, isNil))
        .subscribe((res: any) => {
          this.listPtSalary = res.data.result;
          this.totalBonus = res.data.totalBonus;
          this.totalRevenue = res.data.totalRevenue;
          this.total = res.data.total;
          this.pages = getPage(this.total, this.pageSize);
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    options.isExport = this.isExport;
    this.isExport = false;
    return this.reportPayrollSvc
      .getListPtReportSalary(omitBy(options, isNil))
      .toPromise();
  }

  public async exportExcelPTSalary() {
    this.isExport = true;
    const dataExport: any = await this.getListPtSalary();
    if (dataExport?.data?.result) {
      exportExcel(dataExport?.data?.result, "report-pt-salary.xlsx");
      this.spinner.hide();
    }
  }
}