import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ClassCategory } from 'src/app/core/models/class/class-category.model';
import { Class } from 'src/app/core/models/class/class.model';
import { ClassService } from 'src/app/core/services/class/class.service';
import { FormConfirmBoxComponent } from 'src/app/shared/forms/form-confirm-box/form-confirm-box.component';
import { FormClassCategoryComponent } from '../form-class/form-class-category/form-class-category.component';
import { FormClassComponent } from '../form-class/form-class/form-class.component';

@Component({
  selector: 'app-class-management',
  templateUrl: './class-management.component.html',
  styleUrls: ['./class-management.component.scss']
})
export class ClassManagementComponent implements OnInit {
  listClassCategory: ClassCategory[] = [];
  listClass: Class[] = [];
  classCategoryId: string;
  selectedIndexClassCategory: number;
  selectedIndexClass: number;
  selectedClassCategory: string;

  constructor(
    private spinner: NgxSpinnerService,
    private classSvc: ClassService,
    public translate: TranslateService,
    private alert: ToastrService,
    private modalSvc: NgbModal
  ) { }

  ngOnInit(): void {
    this._getListClassCategory();
  }

  private _getListClassCategory() {
    this.spinner.show();
    this.classSvc.getListClassCategory().subscribe((res: any) => {
      this.listClassCategory = res.data;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  private _deleteClassCategory(categoryId: string) {
    this.spinner.show();
    const body = {
      id: categoryId
    };
    this.classSvc.deleteClassCategory(body).subscribe(res => {
      if (res) {
        this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
        this._getListClassCategory();
        this.spinner.hide();
      }
    }, () => this.spinner.hide());
  }

  private _deleteClass(classId: string) {
    this.spinner.show();
    const body = {
      id: classId
    };
    this.classSvc.deleteClass(body).subscribe(res => {
      if (res) {
        this.alert.success(this.translate.instant('FORM.DELETE_SUCCESS'));
        this.showClass(this.selectedClassCategory);
        this.spinner.hide();
      }
    }, () => this.spinner.hide());
  }

  public setIndexClassCategory(index: any) {
    this.selectedIndexClassCategory = index;
  };

  public showClass(categoryId: string) {
    this.selectedClassCategory = categoryId;
    this.spinner.show();
    this.classSvc.getListClassByCategory(categoryId).subscribe((res: any) => {
      this.listClass = res.data;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  public deleteClassCategory(categoryId: string) {
    const modalRef = this.modalSvc.open(
      FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.CONFIRM_DELETE_CLASS_CATEGORY';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deleteClassCategory(categoryId) : {};
    });
  }

  public editClassCategory(categoryClass: any) {
    const modalRef = this.modalSvc.open(
      FormClassCategoryComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.categoryClass = categoryClass;
    modalRef.componentInstance.action = 'EDIT';
    modalRef.componentInstance.title = 'FORM.EDIT_CLASS_CATEGORY';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._getListClassCategory() : {};
    });
  }

  public editClass(_class: any) {
    const modalRef = this.modalSvc.open(
      FormClassComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.class = _class;
    modalRef.componentInstance.action = 'EDIT';
    modalRef.componentInstance.title = 'FORM.EDIT_CLASS';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.showClass(this.selectedClassCategory) : {};
    });
  }

  public deleteClass(classId: string) {
    const modalRef = this.modalSvc.open(
      FormConfirmBoxComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.title = 'FORM.CONFIRM_DELETE_CLASS';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._deleteClass(classId) : {};
    });
  }

  public addClassCategory() {
    const modalRef = this.modalSvc.open(
      FormClassCategoryComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.action = 'CREATE';
    modalRef.componentInstance.title = 'FORM.ADD_CLASS_CATEGORY';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this._getListClassCategory() : {};
    });
  }

  public addClass() {
    const modalRef = this.modalSvc.open(
      FormClassComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.classCategoryId = this.selectedClassCategory;
    modalRef.componentInstance.action = 'CREATE';
    modalRef.componentInstance.title = 'FORM.ADD_CLASS';
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res ? this.showClass(this.selectedClassCategory) : {};
    });
  }
}
