import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models/share/club.model';
import { PaymentMethod } from 'src/app/core/models/share/payment-method.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, hyperLinkMember } from 'src/app/core/utils';

@Component({
  selector: 'app-report-revenue',
  templateUrl: './report-revenue.component.html',
  styleUrls: ['./report-revenue.component.scss']
})
export class ReportRevenueComponent implements OnInit {
  listClub: Club[];
  listPaymentMethod: PaymentMethod[];
  listPackage: any;
  userInfo: UserProfile;

  constructor(
    private shareSvc: ShareService,
    private authSvc: AuthenticationService
  ) { }

  async ngOnInit() {
    this._getUserInfo();
    [this.listClub, this.listPaymentMethod, this.listPackage] = await Promise.all([
      getDataSelect(this.shareSvc.getListClub()),
      getDataSelect(this.shareSvc.getListPaymentMethod()),
      getDataSelect(this.shareSvc.getPtListPackage()),
    ]);
  }

  private _getUserInfo() {
    this.userInfo = this.authSvc.getUserProfileLocal();
  }

  public hyperLinkMemberRevenue(accountId: string) {
    hyperLinkMember(accountId);
  }
}
