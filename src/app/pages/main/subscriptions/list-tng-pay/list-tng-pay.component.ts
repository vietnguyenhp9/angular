import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { Query } from 'src/app/core/models/share/query.model';
import { ShareService } from 'src/app/core/services/share/share.service';
import { SubscriptionsService } from 'src/app/core/services/subscriptions/subscriptions.service';
import { getDataSelect, getPage, hyperLinkMember } from 'src/app/core/utils';
import { TngPayTimelineComponent } from '../tng-pay-timeline/tng-pay-timeline.component';

@Component({
  selector: 'app-list-tng-pay',
  templateUrl: './list-tng-pay.component.html',
  styleUrls: ['./list-tng-pay.component.scss']
})
export class ListTngPayComponent implements OnInit {
  @Input() isListTngPay: boolean;
  listTngPay = [];
  listClub: Club[] = [];
  listPaymentPlanSubscriptions = [];
  listPackageTng = [];
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  dateLimit = SystemConstant.DATE_RANGE.DATE_LIMIT;
  // Filter
  selectedClub: number;
  selectedStatus: string;
  selectedPayment: number;
  selectedFailTotal: string;
  selectedNextChargeDate: {
    startDate: moment.Moment;
    endDate: moment.Moment;
  };
  selectedCreatedDate: {
    startCreatedDate: moment.Moment;
    endCreatedDate: moment.Moment;
  };
  selectedType = 'day';
  isChangeFail = 0;
  isDisableSelected: boolean;
  isOpenChangeFailCount = false;
  listFailCount = [1, 2, 3];
  // Pagination
  total: number;
  pages: number;
  page = SystemConstant.PAGING.PAGES;
  pageSize = SystemConstant.PAGING.PAGESIZE;
  // Query
  today: any = moment().format('YYYY-MM-DD');
  startDate: moment.Moment;
  endDate: moment.Moment;
  startCreatedDate: moment.Moment;
  endCreatedDate: moment.Moment;
  chargeFailCount: number;
  isActive: number;
  clubId: number;
  paymentPlanId: number;
  status: string;
  listStatus = [
    SystemConstant.STATUS.ACTIVE,
    SystemConstant.STATUS.INACTIVE,
    SystemConstant.STATUS.WAITFORRENEW,
    SystemConstant.STATUS.FAIL,
  ];

  constructor(
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private shareSvc: ShareService,
    private subscriptionsSvc: SubscriptionsService,
    private modalSvc: NgbModal,
  ) {
    this.startDate = moment().startOf('day');
    this.endDate = moment().endOf('day');
    this.startCreatedDate = moment().startOf('day');
    this.endCreatedDate = moment().endOf('day');
    this.selectedNextChargeDate = {
      startDate: this.startDate,
      endDate: this.endDate
    };
    this.selectedCreatedDate = {
      startCreatedDate: this.startCreatedDate,
      endCreatedDate: this.endCreatedDate
    };
  }

  async ngOnInit() {
    this.getListSubscriptions();
    this.listClub = await getDataSelect(this.shareSvc.getListClub());
  }

  public hyperLinkMemberTng(accountId: string) {
    hyperLinkMember(accountId);
  }

  public onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.page = 1;
      this.paymentPlanId = this.selectedPayment = null;
      this.listPaymentPlanSubscriptions = [];
      if (selectedClub !== null && !this.isListTngPay) {
        this.getListPaymentPlan();
      }
      this.getListSubscriptions();
    }
  }

  public onChangeStatus(selectedStatus: any) {
    if (![undefined, this.status].includes(selectedStatus)) {
      this.status = selectedStatus;
      this.page = 1;
      this.getListSubscriptions();
    }
  }

  public onChangePayment(selectedPayment: number) {
    if (![undefined, this.paymentPlanId].includes(selectedPayment)) {
      this.paymentPlanId = selectedPayment;
      this.page = 1;
      this.getListSubscriptions();
    }
  }

  public onChangeFailTotal(selectedFailCount: number) {
    this.chargeFailCount = selectedFailCount;
    this.page = 1;
    this.getListSubscriptions();
  }

  public onChangePage(page: number) {
    if (page && this.page !== page) {
      this.page = page;
      this.getListSubscriptions();
    }
  }

  public onCheckActive(isActive: number) {
    this.isActive = isActive ? 1 : 0;
    this.page = 1;
    this.getListSubscriptions();
  }

  public onFilterNextChargeDate(event: any) {
    if (event.startDate && event.endDate) {
      this.page = 1;
      this.startDate = event.startDate;
      this.endDate = event.endDate;
      this.getListSubscriptions();
    }
  }

  public onFilterCreatedDate(event: any) {
    if (event.startDate && event.endDate) {
      this.page = 1;
      this.startCreatedDate = event.startDate;
      this.endCreatedDate = event.endDate;
      this.getListSubscriptions();
    }
  }

  public onCheckChangeFail(isChangeFail: number) {
    this.isChangeFail = isChangeFail ? 1 : 0;
    this.isOpenChangeFailCount = !this.isOpenChangeFailCount;
    if (!isChangeFail) {
      this.selectedFailTotal = null;
      this.chargeFailCount = null;
      this.getListSubscriptions();
    }
  }

  public loadNext(page: number) {
    this.page = page;
    this.getListSubscriptions();
  }

  public async getListPaymentPlan(options?: Query) {
    options = {
      clubId: this.clubId
    };
    this.listPaymentPlanSubscriptions = await
      getDataSelect(this.subscriptionsSvc.getListPaymentPlanSubscriptions(omitBy(options, isNil)));
  }

  public async getListSubscriptions(options?: Query) {
    this.spinner.show();
    const _options = {
      true: {
        startCreatedDate: moment(this.startCreatedDate).format(
          SystemConstant.TIME_FORMAT.DEFAULT
        ),
        endCreatedDate: moment(this.endCreatedDate).format(
          SystemConstant.TIME_FORMAT.DEFAULT
        ),
        status: this.status
      },
      false: {
        isActive: this.isActive,
        paymentPlanId: this.paymentPlanId,
        chargeFailCount: this.chargeFailCount,
        startDate: moment(this.startDate).format(
          SystemConstant.TIME_FORMAT.DEFAULT
        ),
        endDate: moment(this.endDate).format(
          SystemConstant.TIME_FORMAT.DEFAULT
        ),
      },
      default: {
        clubId: this.clubId,
        page: this.page,
        limit: this.pageSize
      }
    };
    // ----Options----
    options = Object.assign(_options[this.isListTngPay.toString()], _options['default']);
    options = omitBy(options, isNil);
    this.subscriptionsSvc.getListSubscriptions(options).subscribe((res: any) => {
      this.total = res.data.total;
      this.pages = getPage(this.total, this.pageSize);
      this.listTngPay = res.data.result.map((item: any) => ({
        ...item,
        classItem: SystemConstant.CLASS_STATUS[item.status]
      }));
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  public viewDetailSubscriptions(subId: string) {
    const modalRef = this.modalSvc.open(
      TngPayTimelineComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    modalRef.componentInstance.subId = subId;
  }
}

