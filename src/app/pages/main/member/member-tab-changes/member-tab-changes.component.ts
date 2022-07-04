import { Component, Input, OnInit } from '@angular/core';
import { isNil, omitBy } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Query } from 'src/app/core/models/share/query.model';
import { MemberService } from 'src/app/core/services/member/member.service';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { getPage } from 'src/app/core/utils';

@Component({
  selector: 'app-member-tab-changes',
  templateUrl: './member-tab-changes.component.html',
  styleUrls: ['./member-tab-changes.component.scss']
})
export class MemberTabChangesComponent implements OnInit {
  @Input() userId: string;
  listMemberChangesLog = [];
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;

  constructor(
    private spinner: NgxSpinnerService,
    private memberSvc: MemberService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getListMemberChangesLog();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListMemberChangesLog();
  }

  public getListMemberChangesLog(options?: Query) {
    this.spinner.show();
    options = {
      accountId: this.userId,
      page: this.page,
      limit: this.pageSize
    };
    this.memberSvc.getListMemberChangesLog(omitBy(options, isNil)).subscribe((res: any) => {
      this.total = res.data.total;
      this.page = getPage(this.total, this.pageSize);
      this.listMemberChangesLog = res.data;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

}
