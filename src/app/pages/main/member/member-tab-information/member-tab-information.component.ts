import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, sum } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { MemberService } from 'src/app/core/services/member/member.service';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-member-tab-information',
  templateUrl: './member-tab-information.component.html',
  styleUrls: ['./member-tab-information.component.scss'],
})
export class MemberTabInformationComponent implements OnInit {
  @Input() userId: string;
  @Output() getUserMemberInfo = new EventEmitter<UserProfile>();
  contractDebit = 0;
  ptContractDebit = 0;
  dateFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  userMemberInfo: UserProfile;
  // ChangeClub
  openSelectBox = false;

  constructor(
    private spinner: NgxSpinnerService,
    private memberSvc: MemberService,
    private shareSvc: ShareService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this._getAllUserInfo();
  }

  private async _getAllUserInfo() {
    this.spinner.show();
    const [memberDebitTranRes, ptDebitTranRes, memberInfoRes]: [any, any, any] =
      await Promise.all([
        this.memberSvc.getListMemberDebitTransactions(this.userId).toPromise(),
        this.memberSvc.getListPtDebitTransactions(this.userId).toPromise(),
        this.shareSvc.getUserInfoById(this.userId).toPromise(),
      ]);
    this.contractDebit = sum(
      map(memberDebitTranRes.data, 'needPaid').map((itm) => Number(itm))
      );
    this.ptContractDebit = sum(
      map(ptDebitTranRes.data, 'needPaid').map((itm) => Number(itm))
    );
    this.userMemberInfo = memberInfoRes.data;
    this.getUserMemberInfo.emit(memberInfoRes.data);
    this.spinner.hide()
  }
  
  // -----------ChangeClub---------------
  toggleClubs() {
    this.openSelectBox = !this.openSelectBox;
  }
}
