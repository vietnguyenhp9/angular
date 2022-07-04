import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Class } from 'src/app/core/models/class/class.model';
import { ImageOptions } from 'src/app/core/models/share/image.model';
import { ClassService } from 'src/app/core/services/class/class.service';
import { ImagesService } from 'src/app/core/services/images/images.service';

@Component({
  selector: 'app-form-class',
  templateUrl: './form-class.component.html',
  styleUrls: ['./form-class.component.scss']
})
export class FormClassComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() action: string;
  @Input() class: Class;
  @Input() classCategoryId: string;
  @Input() title: string;
  // 
  form: FormGroup;
  file = '';
  imageData: any;
  imgUrl: string;
  config: DropzoneConfigInterface = {
    maxFilesize: 50,
    acceptedFiles: 'image/*',
    maxFiles: 1,
    thumbnailWidth: 200,
    addRemoveLinks: true,
    thumbnailHeight: 100,
    uploadMultiple: false,
    init: function () {
      this.on("addedfile", (file) => {
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', undefined].includes(file.type)) {
          this.removeFile(file);
        }
        if (this.files[1]) {
          this.removeFile(this.files[0]);
        }
      });
    }
  };

  constructor(
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    private classSvc: ClassService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private imgSvc: ImagesService
  ) { }

  ngOnInit(): void {
    this._createForm();
  }

  private async _uploadImage() {
    return await new Promise((resolve) => {
      if (this.imageData) {
        this.imgSvc.uploadImage(this.imageData, 'class').subscribe((res: any) => {
          if (res) {
            resolve(res.data.imageId);
            this.alert.success(res.message);
          }
        }, () => this.alert.error(this.translate.instant('FORM.UPLOAD_IMAGE_FAIL')));
      }
    });
  }

  public dropzoneInit(event: any) {
    if (this.class) {
      const imgOptions: ImageOptions = {
        id: this.class.imageId
      };
      this.imgUrl = this.imgSvc.getImage(imgOptions);
      const mockFile = { name: "class_name", size: "50" };
      event.emit("addedfile", mockFile);
      event.emit("thumbnail", mockFile, this.imgUrl);
      event.emit("complete", mockFile);
      event.files.push(mockFile);
    }
  }

  public dropzoneThumbnailfile(event: any) {
    this.imageData = event[0];
  }

  public dropzoneAddedfile(event: any) {
    if (!event[event.length - 1].accepted) {
      this.alert.warning(this.translate.instant('FORM.FILE_NOT_ACCEPT_TYPE'));
    }
  }

  public dropzoneRemoveFile() {
    this.form.get('imageId').setValue(null);
  }

  private _createForm() {
    this.form = this.fb.group({
      classCategoryId: [this.classCategoryId, [Validators.required]],
      descriptionEn: [null, [Validators.required]],
      descriptionVi: [null, [Validators.required]],
      nameEn: [null, [Validators.required]],
      nameVi: [null, [Validators.required]],
      imageId: [null, [Validators.required]],
    });
    if (this.action === SystemConstant.ACTION.EDIT) {
      this._patchValue(this.class);
    }
  }

  private _patchValue(Class: Class) {
    this.form.patchValue({
      classCategoryId: Class.classCategoryId,
      descriptionEn: Class.descriptionEn,
      descriptionVi: Class.descriptionVi,
      nameEn: Class.nameEn,
      nameVi: Class.nameVi,
      imageId: Class.imageId
    });
  }

  public onCancel() {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

  public async onSubmit() {
    this.spinner.show();
    const actionType = {
      CREATE: () => {
        this.classSvc.addClass(this.form.value).subscribe(() => {
          this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
        }, () => this.spinner.hide());
      },
      EDIT: () => {
        this.classSvc.editClass(this.class.id, this.form.value).subscribe(() => {
          this.alert.success(this.translate.instant('FORM.UPDATE_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
        }, () => this.spinner.hide());
      }
    };
    // Set data image after upload
    if (this.imageData) {
      const imageUploaded = await this._uploadImage();
      this.form.get('imageId').setValue(imageUploaded);
    }
    if (this.form.valid) {
      return actionType[this.action]();
    }
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
    this.spinner.hide();
  }

}
