import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { MemberService } from 'src/app/core/services/member/member.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, getPage } from 'src/app/core/utils';

@Component({
  selector: 'app-list-club-members',
  templateUrl: './list-club-members.component.html',
  styleUrls: ['./list-club-members.component.scss']
})
export class ListClubMembersComponent implements OnInit {

  listClub: Club[] = [];
  listClubMember = [];
  // Filter
  selectedClub: number;
  isDisableSelected: boolean;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // Query
  searchValue = '';
  clubId: number;

  constructor(
    private shareSvc: ShareService,
    private memberSvc: MemberService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private router: Router,
    private authSvc: AuthenticationService
  ) { }

  async ngOnInit() {
    this.listClub = await getDataSelect(this.shareSvc.getListClub());
    this._getDataByRole();
  }

  private _getDataByRole() {
    const userInfo = this.authSvc.getUserProfileLocal();
    if (userInfo.clubId) {
      this.clubId = userInfo.clubId;
      this.selectedClub = userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
    }
    this.getListClubMember();
  }

  public viewDetail(member: UserProfile, event: any) {
    const url = UrlConstant.ROUTE.MAIN.CLUB_MEMBERS + `/${member.accountId}`;
    return event.ctrlKey ? window.open(url, '_blank') : this.router.navigate([url]);
  }

  public onSearch() {
    this.page = 1;
    this.getListClubMember();
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.page = 1;
      this.getListClubMember();
    }
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListClubMember();
  }

  public getMemberClass(memberData: any) {
    if (memberData.contract.isFrozen) {
      return SystemConstant.CLASS_STATUS.FREEZED;
    }
    if (memberData.contract.status) {
      const typeClass = {
        CURRENT: SystemConstant.CLASS_STATUS.CURRENT,
        FUTURE: SystemConstant.CLASS_STATUS.FUTURE,
        CANCELLED: SystemConstant.CLASS_STATUS.CANCELLED,
        WAITFORPAYMENT: SystemConstant.CLASS_STATUS.WAITFORPAYMENT,
        BLOCKED: SystemConstant.CLASS_STATUS.BLOCKED
      };
      return typeClass[memberData.contract.status];
    }
    return SystemConstant.CLASS_STATUS.DEFAULT;
  }

  public getListClubMember(options?: Query) {
    this.spinner.show();
    options = {
      queryString: this.searchValue,
      clubId: this.clubId,
      page: this.page,
      limit: this.pageSize,
    };
    this.memberSvc.getListClubMember(omitBy(options, isNil)).subscribe((res: any) => {
      this.total = res.data.total;
      this.pages = getPage(this.total, this.pageSize);
      this.listClubMember = res.data.result.map((item: any) => ({
        ...item,
        classMember: this.getMemberClass(item)
      }));
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

}
