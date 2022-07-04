import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { MemberService } from 'src/app/core/services/member/member.service';
import { hasClass, resizePopupBody } from 'src/app/core/utils';

import {
  FormClassBookingDetailComponent,
} from '../form-members/form-class-booking-detail/form-class-booking-detail.component';

@Component({
  selector: 'app-member-tab-bookings',
  templateUrl: './member-tab-bookings.component.html',
  styleUrls: ['./member-tab-bookings.component.scss'],
})
export class MemberTabBookingsComponent implements OnInit, AfterViewInit {
  @Input() userId: string;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('calendar') calendarUI: any;
  // -----------
  classBookingEvents: any = [];
  ptBookingEvents: any = [];
  startDate: moment.Moment = moment().startOf('month');
  endDate: moment.Moment = moment().endOf('month');
  currentDate: any;
  typeBookingSelected = 'CLASSBOOKING';
  typeBooking = {
    CLASSBOOKING: 'CLASSBOOKING',
    PTBOOKING: 'PTBOOKING',
  };
  // Calendar Option
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'dayGridMonth,dayGridWeek,dayGridDay,classBooking,ptBooking',
      center: 'title',
      right: 'today,prev,next',
    },
    customButtons: {
      dayGridMonth: {
        text: 'Month',
        click: () => {
          this._getCurrentDateCalendar(
            this.typeBookingSelected,
            'month',
            'dayGridMonth'
          );
        },
      },
      dayGridWeek: {
        text: 'Week',
        click: () => {
          this._getCurrentDateCalendar(
            this.typeBookingSelected,
            'week',
            'dayGridWeek'
          );
        },
      },
      dayGridDay: {
        text: 'Day',
        click: () => {
          this._getCurrentDateCalendar(
            this.typeBookingSelected,
            'day',
            'dayGridDay'
          );
        },
      },
      classBooking: {
        text: 'CLASS',
        click: () => {
          this.getListBooking(this.typeBooking['CLASSBOOKING']);
          this.typeBookingSelected = this.typeBooking['CLASSBOOKING'];
          this.calendarUI.element.nativeElement
            .querySelector('.fc-classBooking-button')
            .classList.add('fc-class-active');
          this.calendarUI.element.nativeElement
            .querySelector('.fc-ptBooking-button')
            .classList.remove('fc-pt-active');
        },
      },
      ptBooking: {
        text: 'PT',
        click: () => {
          this.getListBooking(this.typeBooking['PTBOOKING']);
          this.typeBookingSelected = this.typeBooking['PTBOOKING'];
          this.calendarUI.element.nativeElement
            .querySelector('.fc-ptBooking-button')
            .classList.add('fc-pt-active');
          this.calendarUI.element.nativeElement
            .querySelector('.fc-classBooking-button')
            .classList.remove('fc-class-active');
        },
      },
      prev: {
        text: '',
        click: () => {
          this.calendarComponent.getApi().prev();
          this._getOptionsDateFilter(this.typeBookingSelected);
        },
      },
      next: {
        text: '',
        click: () => {
          this.calendarComponent.getApi().next();
          this._getOptionsDateFilter(this.typeBookingSelected);
        },
      },
      today: {
        text: 'Today',
        click: () => {
          this.calendarComponent.getApi().today();
          this._getOptionsDateFilter(this.typeBookingSelected);
        },
      },
    },
    initialView: 'dayGridMonth',
    // showNonCurrentDates: false,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: false,
    },
    themeSystem: 'bootstrap',
    events: this.classBookingEvents,
    nowIndicator: true,
    displayEventEnd: true,
    eventDisplay: 'list',
    eventOrder: 'start',
    slotEventOverlap: false,
    dayMaxEventRows: true,
    views: {
      dayGridMonth: {
        dayMaxEventRows: SystemConstant.NUMBER_EVENT_CALENDAR.MONTH,
      },
      dayGridWeek: {
        dayMaxEventRows: SystemConstant.NUMBER_EVENT_CALENDAR.WEEK,
      },
      dayGridDay: {
        dayMaxEventRows: SystemConstant.NUMBER_EVENT_CALENDAR.DAY,
      },
    },
    eventClick: (event) => {
      return this.typeBookingSelected === this.typeBooking['CLASSBOOKING']
        ? this.showClassBookingDetail(event)
        : this.showPTBookingDetail(event);
    },
    eventDidMount: (event) => {
      if (this.typeBookingSelected === this.typeBooking['PTBOOKING']) {
        const _event = event.event._def.extendedProps.data;
        const status = _event.status === 'COMPLETED';
        const ptPackage =
          this.translate.currentLang === 'en'
            ? _event.ptPackageNameEn
            : _event.ptPackageNameVi;
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
    },
  };

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private memberSvc: MemberService,
    public translate: TranslateService,
    private modalSvc: NgbModal
  ) {}

  ngOnInit(): void {
    this.getListBooking(this.typeBooking['CLASSBOOKING']);
  }

  private _getCurrentDateCalendar(
    typeBooking: string,
    typeDate: any,
    typeView: any
  ) {
    this.calendarComponent.getApi().changeView(typeView);
    this.currentDate = this.calendarComponent.getApi().getDate();
    this.startDate = moment(this.currentDate).startOf(typeDate);
    this.endDate = moment(this.currentDate).endOf(typeDate);
    this.getListBooking(typeBooking);
  }

  private _getOptionsDateFilter(typeBooking: string) {
    const typeView = {
      dayGridMonth: () => {
        this._getCurrentDateCalendar(typeBooking, 'month', 'dayGridMonth');
      },
      dayGridWeek: () => {
        this._getCurrentDateCalendar(typeBooking, 'week', 'dayGridWeek');
      },
      dayGridDay: () => {
        this._getCurrentDateCalendar(typeBooking, 'day', 'dayGridDay');
      },
    };
    return typeView[this.calendarComponent.getApi().view.type]();
  }

  // Add Event Source By Custome View
  public addEventSource(evenSourse: EventInput[]) {
    this.calendarComponent.getApi().removeAllEvents();
    this.calendarComponent.getApi().addEventSource(evenSourse);
    this.calendarComponent.getApi().refetchEvents();
    this.updateSizeCalendar();
  }

  public getListBooking(typeBooking: string, options?: Query) {
    this.spinner.show();
    options = {
      startDate: moment(this.startDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: moment(this.endDate).format(SystemConstant.TIME_FORMAT.DEFAULT),
    };
    if (typeBooking === this.typeBooking['CLASSBOOKING']) {
      this.memberSvc.getListMemberBooking(this.userId, options).subscribe(
        (res: any) => {
          this.updateSizeCalendar();
          this.classBookingEvents = this._convertClassBookingToCalendarEvents(
            res.data
          );
          setTimeout(() => {
            if (this.classBookingEvents) {
              this.addEventSource(this.classBookingEvents);
            }
            this.spinner.hide();
          }, 100);
        },
        () => this.spinner.hide()
      );
      return;
    }
    if (typeBooking === this.typeBooking['PTBOOKING']) {
      this.memberSvc.getListMemberPTBooking(this.userId, options).subscribe(
        (res: any) => {
          this.updateSizeCalendar();
          this.ptBookingEvents = this._convertPTBookingToCalendarEvents(
            res.data
          );
          setTimeout(() => {
            if (this.ptBookingEvents) {
              this.addEventSource(this.ptBookingEvents);
            }
            this.spinner.hide();
          }, 100);
        },
        () => this.spinner.hide()
      );
    }
  }

  private _convertClassBookingToCalendarEvents(classBooking): EventInput[] {
    const listClassBooking = [];
    // Map Data Theo Event Object Của Fullcalendar
    classBooking.forEach((item) => {
      listClassBooking.push({
        title: item.classNameEn,
        start: moment(item.beginningDateTime).format(
          SystemConstant.TIME_FORMAT.DEFAULT
        ),
        end: moment(item.beginningDateTime)
          .add(item.durationInMins, 'minutes')
          .format(SystemConstant.TIME_FORMAT.DEFAULT),
        status: item.status,
        data: item,
        classNames:
          SystemConstant.CLASS_STATUS_CALENDAR[item.status] ||
          SystemConstant.CLASS_STATUS_CALENDAR.DEFAULT,
      });
    });
    return listClassBooking;
  }

  private _convertPTBookingToCalendarEvents(ptBooking): EventInput[] {
    const listPtBooking = [];
    // Map Data Theo Event Object Của Fullcalendar
    ptBooking.forEach((item) => {
      listPtBooking.push({
        title: item.ptName,
        start: moment(item.startDate).format(
          SystemConstant.TIME_FORMAT.DEFAULT
        ),
        end: moment(item.endDate).format(SystemConstant.TIME_FORMAT.DEFAULT),
        status: item.status,
        data: item,
        classNames:
          SystemConstant.CLASS_STATUS_CALENDAR[item.status] ||
          SystemConstant.CLASS_STATUS_CALENDAR.DEFAULT,
      });
    });
    return listPtBooking;
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.calendarComponent.getApi().updateSize();
    }, 200);
    this.calendarUI.element.nativeElement
      .querySelector('.fc-classBooking-button')
      .classList.add('fc-class-active');
    document.addEventListener('click', (e) => {
      if (hasClass(e.target, 'fc-more-link')) {
        resizePopupBody();
      }
    });
  }

  public updateSizeCalendar() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  // Open Modal Form --- Pending...
  public addClassBooking() {
    // const modalRef = this.modalSvc.open(
    //   FormAddClassBookingComponent, {
    //   centered: true,
    //   size: 'md',
    //   backdrop: true,
    // });
    // modalRef.componentInstance.userId = this.userId;
    // modalRef.componentInstance.closeModal.subscribe(() => {
    //   this.addEventSource(this.classBookingEvents);
    // });
  }

  public addPTBooking() {
    // const modalRef = this.modalSvc.open(
    //   FormAddClassBookingComponent, {
    //   centered: true,
    //   size: 'md',
    //   backdrop: true,
    // });
    // modalRef.componentInstance.userId = this.userId;
    // modalRef.componentInstance.closeModal.subscribe(() => {
    //   this.addEventSource(this.classBookingEvents);
    // });
  }

  public showClassBookingDetail(event: any) {
    const modalRef = this.modalSvc.open(FormClassBookingDetailComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.accountId =
      this.route.snapshot.paramMap.get('id');
    modalRef.componentInstance.detailBooking = event;
    modalRef.componentInstance.type = this.typeBooking['CLASSBOOKING'];
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListBooking(this.typeBookingSelected) : {};
    });
  }

  public showPTBookingDetail(event: any) {
    const modalRef = this.modalSvc.open(FormClassBookingDetailComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.detailBooking = event;
    modalRef.componentInstance.type = this.typeBooking['PTBOOKING'];
    modalRef.componentInstance.closeModal.subscribe(() => {
      // this.addEventSource(this.ptBookingEvents);
      return;
    });
  }
}
