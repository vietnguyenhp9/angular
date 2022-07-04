import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { SubscriptionsService } from 'src/app/core/services/subscriptions/subscriptions.service';
import { omitBy, isNil } from 'lodash';
import { getPage } from 'src/app/core/utils';

@Component({
  selector: 'app-tng-pay-timeline',
  templateUrl: './tng-pay-timeline.component.html',
  styleUrls: ['./tng-pay-timeline.component.scss']
})
export class TngPayTimelineComponent implements OnInit {
  // Id Subscriptions
  @Input() subId: string;
  subDetail: any;
  dateFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE - 5;

  constructor(
    public translate: TranslateService,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private subscriptionSvc: SubscriptionsService
  ) { }

  ngOnInit(): void {
    this.getListDetailSubscriptions();
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListDetailSubscriptions();
  }

  private _mapResultStepSub(step: any) {
    return step?.isProcessing && step?.isSuccess
      ? SystemConstant.STATUS.SUCCESS
      : (step?.isProcessing && !step?.isSuccess
        ? SystemConstant.STATUS.FAIL
        : SystemConstant.STATUS.INPROCESS);
  }

  public getListDetailSubscriptions(options?: Query) {
    this.spinner.show();
    options = {
      limit: this.pageSize,
      page: this.page
    };
    this.subscriptionSvc.getSubscriptionsLogs(this.subId, omitBy(options, isNil)).subscribe((res: any) => {
      this.total = res.data.total;
      this.pages = getPage(this.total, this.pageSize);
      this.subDetail = res.data.result.map(item => ({
        chargeIndex: item.chargeIndex,
        createdAt: item.createdAt,
        isSuccess: item.isSuccess === 0 ? true : false,
        stepInfo: JSON.parse(item.stepInfo),
        stepOneResult: this._mapResultStepSub(JSON.parse(item?.stepInfo)[0]),
        stepTwoResult: this._mapResultStepSub(JSON.parse(item?.stepInfo)[1]),
        stepThreeResult: this._mapResultStepSub(JSON.parse(item?.stepInfo)[2]),
        stepFourResult: this._mapResultStepSub(JSON.parse(item?.stepInfo)[3])
      }));
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  onClose() {
    this.activeModal.dismiss();
    this.spinner.hide();
  }

}
