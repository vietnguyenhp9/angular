import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Class } from 'src/app/core/models/class/class.model';
import { Club } from 'src/app/core/models/share/club.model';
import { ClassService } from 'src/app/core/services/class/class.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { formatDate, getDataSelect, resetFieldForm } from 'src/app/core/utils';

@Component({
  selector: 'app-form-schedule-class',
  templateUrl: './form-schedule-class.component.html',
  styleUrls: ['./form-schedule-class.component.scss']
})
export class FormScheduleClassComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() idBook: string;
  @Input() action: string;
  @Input() title: string;

  form: FormGroup;
  timeFormat = SystemConstant.TIME_FORMAT.HH_MM_SS;
  dateFormat = SystemConstant.TIME_FORMAT.YY_MM_DD;
  listPaymentMethod = [];
  listClub: Club[] = [];
  listClass: Class[] = [];
  isShowRepeat = false;
  studioDetail: any;


  constructor(
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    private classSvc: ClassService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private shareSvc: ShareService,
    private activeModal: NgbActiveModal
  ) { }

  async ngOnInit() {
    this._createForm();
    [this.listClub, this.listClass] = await Promise.all([
      getDataSelect(this.shareSvc.getListClub()),
      getDataSelect(this.classSvc.getListClass()),
    ]);
  }

  private _getScheduleClass() {
    this.spinner.show();
    this.classSvc.getScheduleClass(this.idBook).subscribe(async (res: any) => {
      if (res) {
        this.studioDetail = await this._getStudioByClub(res.data.clubId);
        this._patchValue(res.data);
      }
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  private _createForm() {
    const today = new Date();
    const beginDate = moment(today).format(this.dateFormat);
    const beginTime = moment(today).format(this.timeFormat);
    this.form = this.fb.group({
      clubId: [null, Validators.required],
      beginDate: [beginDate, Validators.required],
      beginTime: [beginTime, Validators.required],
      classId: [null, [Validators.required]],
      durationInMins: [60, [Validators.required]],
      maxiumNumberOfMember: [20, [Validators.required]],
      maxiumReserveMember: [5, [Validators.required]],
      ptId: [1, [Validators.required]],
      studioId: [null, [Validators.required]],
      nameStudio: [{ value: null, disabled: true }],
      // 
      isRepeat: false,
      isRepeatOnSunday: false,
      isRepeatOnMonday: false,
      isRepeatOnTuesday: false,
      isRepeatOnWednesday: false,
      isRepeatOnThursday: false,
      isRepeatOnFriday: false,
      isRepeatOnSaturday: false,
    });
    if (this.action === SystemConstant.ACTION.EDIT) {
      this._getScheduleClass();
    }
  }

  private async _patchValue(classData: any) {
    this.form.patchValue({
      clubId: parseInt(classData.clubId),
      beginDate: moment(classData.beginningDateTime).format(this.dateFormat),
      beginTime: moment(classData.beginningDateTime).format(this.timeFormat),
      classId: classData.classId,
      durationInMins: classData.durationInMins,
      maxiumNumberOfMember: classData.maxiumNumberOfMember,
      maxiumReserveMember: classData.maxiumReserveMember,
      ptId: classData.ptId,
      studioId: classData.studioId,
      nameStudio: this.translate.currentLang === 'en' ? this.studioDetail.nameEn : this.studioDetail.nameVi,
      isRepeat: classData.isRepeat,
      isRepeatOnSunday: classData?.schedule?.isRepeatOnSunday || false,
      isRepeatOnMonday: classData?.schedule?.isRepeatOnMonday || false,
      isRepeatOnTuesday: classData?.schedule?.isRepeatOnTuesday || false,
      isRepeatOnWednesday: classData?.schedule?.isRepeatOnWednesday || false,
      isRepeatOnThursday: classData?.schedule?.isRepeatOnThursday || false,
      isRepeatOnFriday: classData?.schedule?.isRepeatOnFriday || false,
      isRepeatOnSaturday: classData?.schedule?.isRepeatOnSaturday || false
    });
    this.isShowRepeat = classData.isRepeat;
  }

  // Map data before create / edit
  private _mapData() {
    const form = this.form.controls;
    return {
      beginningDateTime: formatDate(form.beginDate, form.beginTime),
      schedule: {
        isRepeatOnSunday: form.isRepeatOnSunday.value,
        isRepeatOnMonday: form.isRepeatOnMonday.value,
        isRepeatOnTuesday: form.isRepeatOnTuesday.value,
        isRepeatOnWednesday: form.isRepeatOnWednesday.value,
        isRepeatOnThursday: form.isRepeatOnThursday.value,
        isRepeatOnFriday: form.isRepeatOnFriday.value,
        isRepeatOnSaturday: form.isRepeatOnSaturday.value,
      },
      clubId: form.clubId.value,
      classId: form.classId.value,
      durationInMins: form.durationInMins.value,
      maxiumNumberOfMember: form.maxiumNumberOfMember.value,
      maxiumReserveMember: form.maxiumReserveMember.value,
      ptId: form.ptId.value,
      studioId: form.studioId.value,
      isRepeat: form.isRepeat.value,
    };
  }

  public onSubmit() {
    const body = this._mapData();
    this.spinner.show();
    const actionType = {
      CREATE: () => {
        this.classSvc.createScheduleClass(body).subscribe(() => {
          this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
        }, () => this.spinner.hide());
      },
      EDIT: () => {
        this.classSvc.editScheduleClass(this.idBook, body).subscribe(() => {
          this.alert.success(this.translate.instant('FORM.UPDATE_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
        }, () => this.spinner.hide());
      }
    };
    if (this.form.valid) {
      return actionType[this.action]();
    }
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
    this.spinner.hide();
  }

  public onCancel() {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

  private async _getStudioByClub(clubId: number) {
    return await new Promise((resolve) => {
      this.classSvc.getStudioByClub(clubId).subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }

  public async onChangeClub(selectedClub: number) {
    if (![undefined, null].includes(selectedClub)) {
      this.studioDetail = await this._getStudioByClub(selectedClub);
      const nameStudio = this.translate.currentLang === 'en' ? this.studioDetail.nameEn : this.studioDetail.nameVi;
      this.form.get('nameStudio').setValue(nameStudio);
      this.form.get('studioId').setValue(this.studioDetail.id);
    }
  }

  public showRepeat() {
    this.isShowRepeat = !this.isShowRepeat;
    resetFieldForm(
      this.form,
      ['isRepeatOnSunday', 'isRepeatOnMonday', 'isRepeatOnTuesday', 'isRepeatOnWednesday',
        'isRepeatOnThursday', 'isRepeatOnFriday', 'isRepeatOnSaturday']
    );
  }
}
