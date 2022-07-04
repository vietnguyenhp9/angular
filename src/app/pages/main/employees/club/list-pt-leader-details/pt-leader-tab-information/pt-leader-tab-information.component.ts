import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-pt-leader-tab-information',
  templateUrl: './pt-leader-tab-information.component.html',
  styleUrls: ['./pt-leader-tab-information.component.scss']
})
export class PtLeaderTabInformationComponent implements OnInit {
  @Input() userId: string;
  @Output() getPtLeaderInfoInfoFromChild = new EventEmitter<UserProfile>();
  userMemberInfo: UserProfile;
  contractDebit = 0;
  ptContractDebit = 0;
  dateFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
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
    private spinner: NgxSpinnerService,
    private shareSvc: ShareService,
    public translate:TranslateService
  ) { }

  ngOnInit(): void {
    this._getPtLeaderInfoDetail();
  }

  private _getPtLeaderInfoDetail() {
    this.spinner.show();
    this.shareSvc.getUserInfoById(this.userId).subscribe( (res: any) => {
      this.userMemberInfo = res.data;
      this.getPtLeaderInfoInfoFromChild.emit(res.data);
      this.spinner.hide()
    }, () => this.spinner.hide());
  }

}
