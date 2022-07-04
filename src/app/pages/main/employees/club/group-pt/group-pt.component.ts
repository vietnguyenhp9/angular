import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Club } from 'src/app/core/models/share/club.model';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect } from 'src/app/core/utils';
import { FormConfirmBoxComponent } from 'src/app/shared/forms/form-confirm-box/form-confirm-box.component';
import { omitBy, isNil } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { isEmpty } from 'lodash';
import { FormAddPtComponent } from '../form-club/form-add-pt/form-add-pt.component';
import { ErrorService } from 'src/app/core/services/common/error.service';

@Component({
  selector: 'app-group-pt',
  templateUrl: './group-pt.component.html',
  styleUrls: ['./group-pt.component.scss']
})
export class GroupPtComponent implements OnInit {
  listClub: Club[] = [];
  listGroup = [];
  selectedIndexClub: number;
  selectedIndexGroup: number;
  ptLeader: any = {};
  currentGroup: number;
  listPT = [];
  listPTForAdd = [];
  // 
  clubId: number;
  listPTForAddGroup = [];
  listPTLeaderForAddGroup = [];

  constructor(
    private shareSvc: ShareService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private authSvc: AuthenticationService,
    private modalSvc: NgbModal,
    private employeesSvc: EmployeesService,
    private alert: ToastrService,
    private errorSvc: ErrorService
  ) { }

  ngOnInit(): void {
    this._getDataByRole();
  }

  private async _getDataByRole() {
    const userInfo = this.authSvc.getUserProfileLocal();
    if (!userInfo.clubId) {
      this.listClub = await getDataSelect(this.shareSvc.getListClub());
    }
    else {
      const _listClub = await getDataSelect(this.shareSvc.getClubDetailById(userInfo.clubId));
      this.listClub = [_listClub];
    }
  }

  public async showGroupPT(clubId: number) {
    this.spinner.show();
    this.clubId = clubId;
    this.listPT = [];
    this.listPTForAdd = [];
    this.ptLeader = {};
    this.shareSvc.getListGroupByClub(clubId).subscribe((res: any) => {
      this.listGroup = res.data;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  public setIndexClub(index: any) {
    this.selectedIndexClub = index;
    this.selectedIndexGroup = null;
  };

  public setIndexGroup(index: any) {
    this.selectedIndexGroup = index;
  };

  public showPTLeaderInGroup(groupId: number) {
    this.spinner.show();
    this.shareSvc.getPtLeaderByGroup(groupId).subscribe((res: any) => {
      this.ptLeader = isEmpty(res.data.result) ? undefined : res.data.result;
      this.spinner.hide;
    }, () => this.spinner.hide());
  }

  public showListPTInGroup(groupId: number) {
    this.spinner.show();
    this.currentGroup = groupId;
    this._updateListPTForAdd();
    this.shareSvc.getListPTByGroup(groupId).subscribe((res: any) => {
      this.listPT = res.data.result;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  public deletePT(ptId: string, type: string) {
    const modalRef = this.modalSvc.open(
      FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.CONFIRM_DELETE_PT';
    const _type = {
      'leader': () => {
        return this._deletePTLeader(ptId);
      },
      'pt': () => {
        return this._deletePT(ptId);
      }
    };
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? _type[type]() : this._getDataGroupPT(this.currentGroup);
    });
  };

  private _getDataGroupPT(currentGroup: number) {
    this.showPTLeaderInGroup(currentGroup);
    this.showListPTInGroup(currentGroup);
  }

  private _deletePT(ptId: string) {
    this.spinner.show();
    const options = {
      ptId: ptId,
      ptGroupId: this.currentGroup,
    };
    this.employeesSvc.deletePtGroup(omitBy(options, isNil)).subscribe((res: any) => {
      if (res) {
        this._getDataGroupPT(this.currentGroup);
        this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
      }
    }, (err) => {
      this.alert.error(this.errorSvc.getServerErrorMessage(err));
    });
    this.spinner.hide();
  }

  private _deletePTLeader(ptLeaderId: string) {
    this.spinner.show();
    const options = {
      body: {
        leaderId: ptLeaderId,
        ptGroupId: this.currentGroup,
      },
    };
    this.employeesSvc.deletePtLeaderGroup(omitBy(options, isNil)).subscribe((res: any) => {
      if (res) {
        this._getDataGroupPT(this.currentGroup);
        this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
      }
    }, (err) => {
      this.alert.error(this.errorSvc.getServerErrorMessage(err));
    });
    this.spinner.hide();
  }


  // Add PT
  public addPT(type: string) {
    const modalRef = this.modalSvc.open(
      FormAddPtComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    //
    const _type = {
      'leader': async () => {
        modalRef.componentInstance.title = 'FORM.ADD_PT_LEADER';
        modalRef.componentInstance.listPT = await getDataSelect(this.employeesSvc.getListPtLeaderForGroup(this.clubId));
        modalRef.componentInstance.type = 'leader';
      },
      'pt': async () => {
        modalRef.componentInstance.title = 'FORM.ADD_PT';
        modalRef.componentInstance.listPT = this.listPTForAdd;
        modalRef.componentInstance.type = 'pt';
      }
    };
    _type[type]();
    // Add PT
    modalRef.componentInstance.ptId.subscribe((res) => {
      if (type === 'leader') {
        this.spinner.show();
        const options = {
          leaderId: res,
          ptGroupId: this.currentGroup
        };
        this.employeesSvc.addPtLeaderGroup(options).subscribe(res => {
          if (res) {
            this._getDataGroupPT(this.currentGroup);
            this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          }
        }, (err) => this.alert.error(this.errorSvc.getServerErrorMessage(err)));
        this.spinner.hide();
      }
      else {
        this.spinner.show();
        const options = {
          ptId: [res],
          ptGroupId: this.currentGroup
        };
        this.employeesSvc.addPtGroup(options).subscribe(res => {
          if (res) {
            this._getDataGroupPT(this.currentGroup);
            this._updateListPTForAdd();
            this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          }
        }, (err) => this.alert.error(this.errorSvc.getServerErrorMessage(err)));
        this.spinner.hide();
      }
    });
  }

  private async _updateListPTForAdd() {
    const listPT = await getDataSelect(this.employeesSvc.getListPT(
      { clubId: this.clubId, limit: 100 }));
    this.listPTForAdd = listPT.filter((x: any) => x.ptGroupId === null);
  }
};
