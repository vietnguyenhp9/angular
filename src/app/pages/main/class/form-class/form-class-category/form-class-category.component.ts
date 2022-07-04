import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { ClassService } from 'src/app/core/services/class/class.service';

@Component({
  selector: 'app-form-class-category',
  templateUrl: './form-class-category.component.html',
  styleUrls: ['./form-class-category.component.scss']
})
export class FormClassCategoryComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() action: string;
  @Input() categoryClass: any;
  @Input() title: string;
  form: FormGroup;

  constructor(
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    private classSvc: ClassService,
    private fb: FormBuilder,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this._createForm();
  }


  private _createForm() {
    this.form = this.fb.group({
      descriptionEn: [null, [Validators.required]],
      descriptionVi: [null, [Validators.required]],
      nameEn: [null, [Validators.required]],
      nameVi: [null, [Validators.required]],
    });
    if (this.action === SystemConstant.ACTION.EDIT) {
      this._patchValue(this.categoryClass);
    }
  }

  private _patchValue(categoryClass: any) {
    this.form.patchValue({
      descriptionEn: categoryClass.descriptionEn,
      descriptionVi: categoryClass.descriptionVi,
      nameEn: categoryClass.nameEn,
      nameVi: categoryClass.nameVi,
    });
  }
  public onCancel() {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

  public onSubmit() {
    this.spinner.show();
    const actionType = {
      CREATE: () => {
        this.classSvc.addClassCategory(this.form.value).subscribe(() => {
          this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
        }, () => this.spinner.hide());
      },
      EDIT: () => {
        this.classSvc.editClassCategory(this.categoryClass.id, this.form.value).subscribe(() => {
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

}
