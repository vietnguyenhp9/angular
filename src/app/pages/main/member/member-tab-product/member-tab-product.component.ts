import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { MemberService } from 'src/app/core/services/member/member.service';
import { getPage } from 'src/app/core/utils';

@Component({
  selector: 'app-member-tab-product',
  templateUrl: './member-tab-product.component.html',
  styleUrls: ['./member-tab-product.component.scss']
})
export class MemberTabProductComponent implements OnInit {
  @Input() userId: string;
  listMemberProducts = [];
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;


  constructor(
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private memberSvc: MemberService
  ) { }

  ngOnInit(): void {
    this.getListMemberProducts();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListMemberProducts();
  }

  public getListMemberProducts(options?: Query) {
    this.spinner.show();
    options = {
      type: 'CLIENT_EXPORT',
      accountId: this.userId,
      limit: this.pageSize,
      page: this.page
    };
    this.memberSvc.getListMemberProducts(omitBy(options, isNil)).subscribe((res: any) => {
      this.total = res.data.total;
      this.pages = getPage(this.total, this.pageSize);
      let _totalProduct = 0;
      this.listMemberProducts = res.data.result.map((item: any) => ({
        ...item,
        totalProduct: _totalProduct += Number(item.price) * Number(item.quantity)
      }));
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

}
