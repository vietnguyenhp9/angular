import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, getPage } from 'src/app/core/utils';
import { FormConfirmBoxComponent } from 'src/app/shared/forms/form-confirm-box/form-confirm-box.component';

@Component({
  selector: 'app-list-request-gm',
  templateUrl: './list-request-gm.component.html',
  styleUrls: ['./list-request-gm.component.scss'],
})
export class ListRequestGmComponent implements OnInit {
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // Data
  listPTRequest: any[];
  listClubs: Club[] = [];
  listGroups: any[];
  //Filter
  clubId: number;
  listPt = [];
  ptId: number;
  ptGroupId: number;
  status: string;
  selectedClub: number;
  selectedGroup: number;
  selectedPt: number;
  selectedStatus: number;
  isDisableSelected: boolean;
  listStatus = [
    SystemConstant.STATUS.WAITFORPAYMENT,
    SystemConstant.STATUS.APPROVE,
  ];
  // Format datetime
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;

  constructor(
    private employeesSvc: EmployeesService,
    private authSvc: AuthenticationService,
    private modalSvc: NgbModal,
    public translate: TranslateService,
    private shareSvc: ShareService,
    private alert: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this._getDataByRole();
    this.getListClubs();
  }

  private _getDataByRole() {
    const userInfo = this.authSvc.getUserProfileLocal();
    if (userInfo.clubId) {
      this.clubId = userInfo.clubId;
      this.selectedClub = userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
      this.getListGroupSelect(this.selectedClub);
    }
    this.getListPtRequest();
  }

  async getListClubs() {
    this.listClubs = await getDataSelect(this.shareSvc.getListClub());
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.listPt = this.listGroups = [];
      this.selectedGroup = this.selectedPt = this.ptId = this.ptGroupId = null;
      this.page = 1;
      this.getListGroupSelect(selectedClub);
      this.getListPtRequest();
    }
  }

  public onChangeGroup(selectedGroup: any) {
    if (![undefined, this.ptGroupId].includes(selectedGroup)) {
      this.ptGroupId = selectedGroup;
      this.listPt = [];
      this.selectedPt = this.ptId = null;
      this.page = 1;
      this.getListPtSelect(selectedGroup);
      this.getListPtRequest();
    }
  }

  public onChangePt(selectedPt: number) {
    if (![undefined, this.ptId].includes(selectedPt)) {
      this.ptId = selectedPt;
      this.page = 1;
      this.getListPtRequest();
    }
  }

  public onChangeStatus(selectedStatus: any) {
    if (![undefined, this.status].includes(selectedStatus)) {
      this.status = selectedStatus;
      this.page = 1;
      this.getListPtRequest();
    }
  }

  public async getListGroupSelect(clubId: number) {
    this.listGroups = await getDataSelect(
      this.shareSvc.getListGroupByClub(clubId)
    );
  }

  public async getListPtSelect(groupId: number) {
    this.listPt = await getDataSelect(this.shareSvc.getListPTByGroup(groupId));
  }

  public getListPtRequest(options?: Query) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      status: this.status,
      ptGroupId: this.ptGroupId,
      ptId: this.ptId,
      page: this.page,
      limit: this.pageSize,
    };
    this.employeesSvc.getListRequestGm(omitBy(options, isNil)).subscribe(
      (resp: any) => {
        this.total = resp.data.total;
        this.pages = getPage(this.total, this.pageSize);
        this.listPTRequest = resp.data.result.map((requestPt: any) => ({
          ...requestPt,
          requestClass: SystemConstant.CLASS_STATUS[requestPt.status],
        }));
        this.spinner.hide();
      },
      () => this.spinner.hide()
    );
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListPtRequest();
  }

  public acceptRequest(requestId: any): void {
    const status = { status: 'APPROVE' };
    const modalRef = this.modalSvc.open(FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.CONFIRM_REQUEST_MESSAGE';
    modalRef.componentInstance.closeModal.subscribe((result) => {
      if (result) {
        this.employeesSvc.approveRejectRequest(requestId, status).subscribe(
          (res) => {
            if (res) {
              this.alert.success(
                this.translate.instant('FORM.CONFIRM_SUCCESS')
              );
              this.getListPtRequest();
            }
          },
          () => {
            this.alert.error(this.translate.instant('FORM.CONFIRM_FAILED'));
          }
        );
      }
    });
  }

  public rejectRequest(requestId?: any): void {
    const status = { status: 'REJECT' };
    const modalRef = this.modalSvc.open(FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.REJECT_REQUEST_MESSAGE';
    modalRef.componentInstance.closeModal.subscribe((result) => {
      if (result) {
        this.employeesSvc.approveRejectRequest(requestId, status).subscribe(
          (res) => {
            if (res) {
              this.alert.success(this.translate.instant('FORM.REJECT_SUCCESS'));
              this.getListPtRequest();
            }
          },
          () => {
            this.alert.error(this.translate.instant('FORM.REJECT_FAILED'));
          }
        );
      }
    });
  }
}
