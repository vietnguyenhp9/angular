import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput, FullCalendarComponent } from '@fullcalendar/angular';
import * as  moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { omitBy, isNil } from 'lodash';
import { hasClass, resizePopupBody } from 'src/app/core/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pt-tab-bookings',
  templateUrl: './pt-tab-bookings.component.html',
  styleUrls: ['./pt-tab-bookings.component.scss']
})
export class PtTabBookingsComponent implements OnInit, AfterViewInit {
  @Input() userId: string;
  @ViewChild("calendar") calendarComponent: FullCalendarComponent;
  // 
  ptBookingEvents: any = [];
  startDate: moment.Moment = moment().startOf('month');
  endDate: moment.Moment = moment().endOf('month');
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
    events: this.ptBookingEvents,
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
    eventDidMount: (event) => {
      const _event = event.event._def.extendedProps;
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
    private spinner: NgxSpinnerService,
    private employeesSvc: EmployeesService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getListPTBooking();
  }

  private _getCurrentDateCalendar(typeDate: any, typeView: any) {
    this.calendarComponent.getApi().changeView(typeView);
    const currentDate: any = this.calendarComponent.getApi().getDate();
    this.startDate = moment(currentDate).startOf(typeDate);
    this.endDate = moment(currentDate).endOf(typeDate);
    this.getListPTBooking();
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

  public getListPTBooking(options?: Query) {
    this.spinner.show();
    options = {
      startDate: moment(this.startDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: moment(this.endDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
    };
    this.employeesSvc.getListPTBooking(this.userId, omitBy(options, isNil)).subscribe((res: any) => {
      this.updateSizeCalendar();
      this.ptBookingEvents = res.data.result.map((item) => ({
        start: moment(item.startDate)
          .format(SystemConstant.TIME_FORMAT.DEFAULT),
        end: moment(item.endDate)
          .format(SystemConstant.TIME_FORMAT.DEFAULT),
        title: item.customerName,
        classNames: SystemConstant.CLASS_STATUS_CALENDAR[item.status],
        ...item
      }));
      setTimeout(() => {
        if (this.ptBookingEvents) {
          this.addEventSource(this.ptBookingEvents);
        }
        this.spinner.hide();
      }, 100);
    }, () => this.spinner.hide());
  }

  public addEventSource(evenSourse: EventInput[]) {
    this.calendarComponent.getApi().removeAllEvents();
    this.calendarComponent.getApi().addEventSource(evenSourse);
    this.calendarComponent.getApi().refetchEvents();
    this.updateSizeCalendar();
  }

  public updateSizeCalendar() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.calendarComponent.getApi().updateSize();
    }, 200);
    document.addEventListener("click", (e) => {
      if (hasClass(e.target, "fc-more-link")) {
        resizePopupBody();
      }
    });
  }
}
