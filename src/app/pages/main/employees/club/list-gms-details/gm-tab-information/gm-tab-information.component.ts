import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-gm-tab-information',
  templateUrl: './gm-tab-information.component.html',
  styleUrls: ['./gm-tab-information.component.scss']
})
export class GmTabInformationComponent implements OnInit {
  @Input() userId: string;
  @Output() getGmInfoFromChild = new EventEmitter<UserProfile>();
  userMemberInfo: UserProfile;
  // Data
  quaterRank: string;
  yearRevenue = 0;
  ptTotal: any;
  leaderTotal: any;

  constructor(
    private spinner: NgxSpinnerService,
    private shareSvc: ShareService,
    private employeeSvc: EmployeesService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this._getAllGmInfo();
  }

  private async _getAllGmInfo() {
    this.spinner.show();
    const [gmInfoRevenue, gmInfoDetail]: [any, any] = await Promise.all([
      this.employeeSvc
        .getGmInfoById(parseInt(sessionStorage.getItem('gmId')))
        .toPromise(),
      this.shareSvc.getUserInfoById(this.userId).toPromise(),
    ]);
    this.quaterRank = gmInfoRevenue.data.currentRank;
    this.yearRevenue = gmInfoRevenue.data.prevYearRevenue;
    this.ptTotal = gmInfoRevenue.data.ptTotal;
    this.leaderTotal = gmInfoRevenue.data.leaderTotal;
    this.userMemberInfo = gmInfoDetail.data; 
    this.getGmInfoFromChild.emit(this.userMemberInfo);
    this.spinner.hide();
  }

}
