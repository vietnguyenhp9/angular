import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models/share/club.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, hyperLinkMember } from 'src/app/core/utils';

@Component({
  selector: 'app-report-customer',
  templateUrl: './report-customer.component.html',
  styleUrls: ['./report-customer.component.scss']
})
export class ReportCustomerComponent implements OnInit {
  listClub: Club[];
  listPackage: any;
  userInfo: UserProfile;
  constructor(
    private shareSvc: ShareService,
    private authSvc: AuthenticationService
  ) { }

  async ngOnInit() {
    this._getUserInfo();
    [this.listClub] = await Promise.all([
      getDataSelect(this.shareSvc.getListClub()),
    ]);
  }

  private _getUserInfo() {
    this.userInfo = this.authSvc.getUserProfileLocal();
  }

  public hyperLinkMemberCustomer(accountId: string) {
    hyperLinkMember(accountId);
  }
}
