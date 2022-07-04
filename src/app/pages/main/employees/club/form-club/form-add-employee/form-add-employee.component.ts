import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { City } from 'src/app/core/models/share/city.model';
import { Club } from 'src/app/core/models/share/club.model';
import { District } from 'src/app/core/models/share/district.model';
import { EmployeesService } from 'src/app/core/services/employees/employees.service';
import { ShareService } from 'src/app/core/services/share/share.service';
import { resetFieldForm } from 'src/app/core/utils';
import { checkBirthday } from 'src/app/core/validators/check-birthday.validator';

@Component({
  selector: 'app-form-add-employee',
  templateUrl: './form-add-employee.component.html',
  styleUrls: ['./form-add-employee.component.scss']
})
export class FormAddEmployeeComponent implements OnInit {
  @Input() accountType: string;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;

  // Data
  listCountry = [];
  listCity: City[] = [];
  listDistrict: District[] = [];
  listClub: Club[] = [];
  listAccessRule = [];
  listRole = [];
  listAreaCodeNumber = [84];
  defaultAreaCode = 84;
  countryId: number;
  cityId: number;
  districtId: number;
  listGender = [
    {
      value: true,
      name: 'MALE'
    },
    {
      value: false,
      name: 'FEMALE',
    }
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private shareSvc: ShareService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    private fb: FormBuilder,
    private employeesSvc: EmployeesService
  ) { }

  ngOnInit(): void {
    this._getListCountry();
    this._getListRoles();
    this._getListClub();
    this._getListAccessRule();
    this._createForm();
  }

  private _getListRoles() {
    this.shareSvc.getListRole()
      .subscribe((res: any) => {
        this.listRole = res.data;
      });
  }

  private _getListClub() {
    this.shareSvc.getListClub()
      .subscribe((res: any) => {
        this.listClub = res.data;
      });
  }

  private _getListAccessRule() {
    this.shareSvc
      .getListAccessRule()
      .subscribe((res: any) => {
        this.listAccessRule = res.data;
      });
  }

  private _getListCountry() {
    this.shareSvc.getListCountry().subscribe((res: any) => {
      this.listCountry = res.data;
    });
  }

  private _getListCity(countryId: number) {
    this.shareSvc
      .getListCityByCountryId(countryId)
      .subscribe((res: any) => {
        this.listCity = res.data;
      });
  }

  private _getListDistrict(cityId: number) {
    this.shareSvc
      .getListDIstrictByCityId(cityId)
      .subscribe((res: any) => {
        this.listDistrict = res.data;
      });
  }

  private _createForm() {
    const roleDefault = {
      "GM": 31,
      "PT": 2,
      "LEADER": 32
    };
    this.form = this.fb.group({
      clubId: [null, Validators.required],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      fullName: [''],
      birthday: ['', [Validators.required, checkBirthday]],
      identityNumber: ['', Validators.required],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      countryId: [null, Validators.required],
      cityId: [null, Validators.required],
      districtId: [null, Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      accessRuleId: [null, Validators.required],
      accountType: [this.accountType],
      roleId: [roleDefault[this.accountType], [Validators.required]],
      isAppliesToAllClubs: [],
      isInstructor: [],
    });
  }

  public onChangeCountry(countryId: number) {
    resetFieldForm(
      this.form,
      ['districtId', 'cityId']
    );
    this.listDistrict = this.listCity = [];
    this.cityId = this.districtId = null;
    if (![undefined, null].includes(countryId)) {
      this._getListCity(countryId);
    }
  }

  public onChangeCity(cityId: number) {
    resetFieldForm(
      this.form,
      ['districtId']
    );
    this.listDistrict = [];
    if (![undefined, null].includes(cityId)) {
      this._getListDistrict(cityId);
    }
  }

  public onSubmit() {
    this.form.get('fullName').setValue(this.form.get('firstName').value + ' ' + this.form.get('lastName').value);
    if (this.form.valid) {
      this.spinner.show();
      this.employeesSvc.createNewEmployees(this.form.value)
        .subscribe(() => {
          this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
          this.spinner.hide();
        }, () => this.spinner.hide());
      return;
    }
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
  }

  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }
}

