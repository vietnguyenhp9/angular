import { Component, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, getListMonthYear, hyperLinkMember } from 'src/app/core/utils';

@Component({
  selector: 'app-report-payroll',
  templateUrl: './report-payroll.component.html',
  styleUrls: ['./report-payroll.component.scss']
})
export class ReportPayrollComponent implements OnInit {
  listClub = [];
  listMonth = [];
  listYear = [];
  userInfo: UserProfile;

  constructor(
    private shareSvc: ShareService,
    private authSvc: AuthenticationService
  ) { }

  async ngOnInit() {
    this._getUserInfo();
    [this.listClub, this.listMonth, this.listYear] = await Promise.all([
      getDataSelect(this.shareSvc.getListClub()),
      getListMonthYear().month,
      getListMonthYear().year
    ]);
  }

  private _getUserInfo() {
    this.userInfo = this.authSvc.getUserProfileLocal();
  }

  public hyperLinkMemberPayroll(accountId: string) {
    hyperLinkMember(accountId);
  }
}
