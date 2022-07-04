import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-pt-tab-information',
  templateUrl: './pt-tab-information.component.html',
  styleUrls: ['./pt-tab-information.component.scss']
})
export class PtTabInformationComponent implements OnInit {
  @Input() userId: string;
  @Output() getUserPtInfo = new EventEmitter<UserProfile>();
  contractDebit = 0;
  ptContractDebit = 0;
  dateFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  userMemberInfo: UserProfile;
  // ChangeClub
  openSelectBox = false;
  // Data
  percentagePt = 0;
  percentagePtNext = 0;
  totalPayroll = 0;
  bonusPayroll = 0;
  revenue = 0;
  bonusGroup = 0;
  revenueGroup = 0;
  groupId: number;

  constructor(
    private shareSvc: ShareService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this._getUserPtInfo();
  }

  private _getUserPtInfo() {
    this.spinner.show();
    this.shareSvc.getUserInfoById(this.userId).subscribe(async (res: any) => {
      this.userMemberInfo = res.data;
      this.getUserPtInfo.emit(res.data);
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  // -----------ChangeClub---------------
  toggleClubs() {
    this.openSelectBox = !this.openSelectBox;
  }

}
