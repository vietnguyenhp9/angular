import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy, groupBy } from 'lodash';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, hasClass, resizePopupBody } from 'src/app/core/utils';

import {
  FormPtCalendarBookingDetailComponent,
} from '../form-club/form-pt-calendar-booking-detail/form-pt-calendar-booking-detail.component';

@Component({
  selector: 'app-pt-calendar-booking',
  templateUrl: './pt-calendar-booking.component.html',
  styleUrls: ['./pt-calendar-booking.component.scss']
})
export class PtCalendarBookingComponent implements OnInit, AfterViewInit {
  ptCalendarBookingEvents: any = [];
  @ViewChild("calendar") calendarComponent: FullCalendarComponent;
  // 
  listClub = [];
  listPT = [];
  clubId: number;
  ptId: number;
  arrBykey = {};
  startDate: moment.Moment = moment().startOf('month');
  endDate: moment.Moment = moment().endOf('month');
  // Filter
  selectedClub: number;
  selectedPT: number;
  isDisableSelected: boolean;
  // Calendar Option
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek,dayGridDay',
      center: 'title',
      right: 'today,prev,next'
    },
    customButtons: {
      dayGridMonth: {
        text: 'Month',
        click: () => {
          this._getCurrentDateCalendar('month', 'dayGridMonth');
        }
      },
      dayGridWeek: {
        text: 'Week',
        click: () => {
          this._getCurrentDateCalendar('week', 'dayGridWeek');
        }
      },
      dayGridDay: {
        text: 'Day',
        click: () => {
          this._getCurrentDateCalendar('day', 'dayGridDay');
        }
      },
      prev: {
        text: '',
        click: () => {
          this.calendarComponent.getApi().prev();
          this._getOptionsDateFilter();
        }
      },
      next: {
        text: '',
        click: () => {
          this.calendarComponent.getApi().next();
          this._getOptionsDateFilter();
        }
      },
      today: {
        text: 'Today',
        click: () => {
          this.calendarComponent.getApi().today();
          this._getOptionsDateFilter();
        }
      }
    },
    initialView: 'dayGridMonth',
    // showNonCurrentDates: false,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: false,
    },
    themeSystem: "bootstrap",
    events: this.ptCalendarBookingEvents,
    nowIndicator: true,
    displayEventEnd: true,
    eventDisplay: 'list',
    eventOrder: 'start',
    slotEventOverlap: false,
    dayMaxEventRows: true,
    views: {
      dayGridMonth: {
        dayMaxEventRows: SystemConstant.NUMBER_EVENT_CALENDAR.MONTH
      },
      dayGridWeek: {
        dayMaxEventRows: SystemConstant.NUMBER_EVENT_CALENDAR.WEEK
      },
      dayGridDay: {
        dayMaxEventRows: SystemConstant.NUMBER_EVENT_CALENDAR.DAY
      }
    },
    eventClick: (event) => {
      this.showBookingDetail(event);
    },
    eventDidMount: (event) => {
      const _event = event.event.extendedProps;
      const status = _event.status === 'COMPLETED';
      const ptPackage = this.translate.currentLang === 'en' ? _event.ptPackageNameEn : _event.ptPackageNameVi;
      const ptContractId = _event.ptContractId;
      // 
      const tag_br = document.createElement('br');
      const tag_span = document.createElement('span');
      // Show ptPackage with status COMPLETED
      tag_span.innerHTML = status ? ptPackage + ' - ' + ptContractId : '- -';
      tag_span.className = 'fc-package';
      // Add child element
      event.el.querySelector('.fc-event-title').appendChild(tag_br);
      event.el.querySelector('.fc-event-title').appendChild(tag_span);
    }
  };

  constructor(
    public translate: TranslateService,
    private shareSvc: ShareService,
    private spinner: NgxSpinnerService,
    private employeesSvc: EmployeesService,
    private modalSvc: NgbModal,
    private authSvc: AuthenticationService
  ) { }

  async ngOnInit() {
    this.listClub = await getDataSelect(this.shareSvc.getListClub());
    this._getDataByRole();
  }

  private async _getDataByRole() {
    const userInfo = this.authSvc.getUserProfileLocal();
    if (userInfo.clubId) {
      this.clubId = userInfo.clubId;
      this.selectedClub = userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
    }
    else {
      this.selectedClub = this.clubId = this.listClub[0].id;
    }
    this.listPT = await getDataSelect(this.shareSvc.getListPtByClub(this.selectedClub));
    this.getListPTCalendarBooking();
  }

  private _getCurrentDateCalendar(typeDate: any, typeView: any) {
    this.calendarComponent.getApi().changeView(typeView);
    const currentDate: any = this.calendarComponent.getApi().getDate();
    this.startDate = moment(currentDate).startOf(typeDate);
    this.endDate = moment(currentDate).endOf(typeDate);
    this.getListPTCalendarBooking();
  }

  private _getOptionsDateFilter() {
    const typeView = {
      dayGridMonth: () => {
        this._getCurrentDateCalendar('month', 'dayGridMonth');
      },
      dayGridWeek: () => {
        this._getCurrentDateCalendar('week', 'dayGridWeek');
      },
      dayGridDay: () => {
        this._getCurrentDateCalendar('day', 'dayGridDay');
      }
    };
    return typeView[this.calendarComponent.getApi().view.type]();
  }

  public async onChangeClub(selectedClub: number) {
    if (![undefined, this.clubId].includes(selectedClub)) {
      this.clubId = selectedClub;
      this.ptId = null;
      this.selectedPT = null;
      this.listPT = await getDataSelect(this.shareSvc.getListPtByClub(selectedClub));
      this.getListPTCalendarBooking();
    }
  }

  public onChangePT(selectedPT: number) {
    if (![undefined, this.ptId].includes(selectedPT)) {
      this.ptId = selectedPT;
      this.getListPTCalendarBooking();
    }
  };

  public getListPTCalendarBooking(options?: Query) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      ptId: this.ptId,
      startDate: moment(this.startDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: moment(this.endDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
    };
    this.employeesSvc.getListPTCalendarBooking(omitBy(options, isNil)).subscribe((res: any) => {
      this.ptCalendarBookingEvents = res.data.map((item) => ({
        start: moment(item.startDate)
          .format(SystemConstant.TIME_FORMAT.DEFAULT),
        end: moment(item.endDate)
          .format(SystemConstant.TIME_FORMAT.DEFAULT),
        title: item.ptName,
        classNames: SystemConstant.CLASS_STATUS_CALENDAR[item.status],
        ...item
      }));
      if (this.ptCalendarBookingEvents) {
        this.arrBykey = groupBy(this.ptCalendarBookingEvents, (item: any) => {
          const day = moment(item.startDate).get('date');
          return `${item.ptId}_${day}`;
        });
        this.addEventSource(this.ptCalendarBookingEvents);
      }
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  public showBookingDetail(event: any) {
    const modalRef = this.modalSvc.open(
      FormPtCalendarBookingDetailComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    const _event = event.event.extendedProps;
    const day = moment(_event.startDate).get('date');
    const ptId = _event.ptId;
    const key = `${ptId}_${day}`;
    modalRef.componentInstance.ptCalendarBooking = this.arrBykey[key];
    modalRef.componentInstance.closeModal.subscribe(() => {
      // Tạm thời chưa dùng (Reload lại data sau khi tắt form)
      // this.addEventSource(this.ptCalendarBookingEvents);
    });
  }

  public addEventSource(evenSourse: EventInput[]) {
    this.calendarComponent.getApi().removeAllEvents();
    this.calendarComponent.getApi().addEventSource(evenSourse);
    this.calendarComponent.getApi().refetchEvents();
    this.updateSizeCalendar();
  }

  public ngAfterViewInit(): void {
    this.updateSizeCalendar();
    document.addEventListener("click", (e) => {
      if (hasClass(e.target, "fc-more-link")) {
        resizePopupBody();
      }
    });
  }

  public updateSizeCalendar() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }
}
