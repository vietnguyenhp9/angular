import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput, FullCalendarComponent } from '@fullcalendar/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { ClassService } from 'src/app/core/services/class/class.service';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect, hasClass, resizePopupBody } from 'src/app/core/utils';

import {
  FormClassCalendarDetailComponent,
} from '../form-class/form-class-calendar-detail/form-class-calendar-detail.component';
import { FormScheduleClassComponent } from '../form-class/form-schedule-class/form-schedule-class.component';

@Component({
  selector: 'app-class-calendar',
  templateUrl: './class-calendar.component.html',
  styleUrls: ['./class-calendar.component.scss']
})
export class ClassCalendarComponent implements OnInit, AfterViewInit {
  classCalendarBookingEvents: any = [];
  @ViewChild("calendar") calendarComponent: FullCalendarComponent;
  // 
  listClub = [];
  listClass = [];
  clubId: number;
  classId: number;
  startDate: moment.Moment = moment().startOf('month');
  endDate: moment.Moment = moment().endOf('month');
  // Filter
  selectedClub: number;
  selectedClass: number;
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
    events: this.classCalendarBookingEvents,
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
    eventClick: (event: any) => {
      this.showBookingDetail(event);
    },
    eventDidMount: (event: any) => {
      const _event = event.event.extendedProps;
      const description = _event.description;
      // Create tag elements
      const tag_span = document.createElement('span');
      tag_span.innerHTML = description;
      tag_span.className = 'fc-booked';
      // Add child element
      event.el.querySelector('.fc-event-title-container').appendChild(tag_span);
      event.el.querySelector('.fc-event-main-frame').classList.add('ps-2');
      event.el.querySelector('.fc-event-title-container').classList.add('flex-between', 'mt-1');
    },
  };

  constructor(
    public translate: TranslateService,
    private shareSvc: ShareService,
    private spinner: NgxSpinnerService,
    private modalSvc: NgbModal,
    private authSvc: AuthenticationService,
    private classSvc: ClassService
  ) { }

  async ngOnInit() {
    this.listClub = await getDataSelect(this.shareSvc.getListClub());
    this.listClass = await getDataSelect(this.classSvc.getListClass());
    this._getDataByRole();
  }

  private _getDataByRole() {
    const userInfo = this.authSvc.getUserProfileLocal();
    if (userInfo.clubId) {
      this.clubId = userInfo.clubId;
      this.selectedClub = userInfo.clubId;
      this.isDisableSelected = !this.isDisableSelected;
    }
    else {
      this.clubId = 1;
      this.selectedClub = 1;
    }
    this.getListClassCalendarBooking();
  }

  private _getCurrentDateCalendar(typeDate: any, typeView: any) {
    this.calendarComponent.getApi().changeView(typeView);
    const currentDate: any = this.calendarComponent.getApi().getDate();
    this.startDate = moment(currentDate).startOf(typeDate);
    this.endDate = moment(currentDate).endOf(typeDate);
    this.getListClassCalendarBooking();
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
      this.classId = null;
      this.selectedClass = null;
      this.getListClassCalendarBooking();
    }
  }

  public onChangeClass(selectedClass: number) {
    if (![undefined, this.classId].includes(selectedClass)) {
      this.classId = selectedClass;
      this.getListClassCalendarBooking();
    }
  };

  public getListClassCalendarBooking(options?: Query) {
    this.spinner.show();
    options = {
      clubId: this.clubId,
      classId: this.classId,
      startDate: moment(this.startDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
      endDate: moment(this.endDate).format(
        SystemConstant.TIME_FORMAT.DEFAULT
      ),
    };
    this.classSvc.getListClassCalendar(omitBy(options, isNil)).subscribe((res: any) => {
      this.classCalendarBookingEvents = res.data.map((item) => ({
        start: moment(item.beginningDateTime)
          .format(SystemConstant.TIME_FORMAT.DEFAULT),
        end: moment(item.beginningDateTime).add(item.durationInMins, 'minutes')
          .format(SystemConstant.TIME_FORMAT.DEFAULT),
        title: this.translate.currentLang === 'en' ? item.nameEn : item.nameVi,
        description: item.bookedMember + '/' + item.maxiumNumberOfMember,
        idBook: item.id,
        ...item
      }));
      if (this.classCalendarBookingEvents) {
        this.addEventSource(this.classCalendarBookingEvents);
      }
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  public showBookingDetail(event: any) {
    const modalRef = this.modalSvc.open(
      FormClassCalendarDetailComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    // Get class by day
    const _event = event.event.extendedProps;
    modalRef.componentInstance.classBookingDetail = _event;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListClassCalendarBooking() : {};
    });
  }

  public addScheduleClass() {
    const modalRef = this.modalSvc.open(
      FormScheduleClassComponent, {
      centered: true,
      size: 'lg',
      backdrop: true,
    });
    // Get class by day
    modalRef.componentInstance.title = 'FORM.ADD_SCHEDULE_CLASS';
    modalRef.componentInstance.action = SystemConstant.ACTION.CREATE;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.getListClassCalendarBooking() : {};
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

