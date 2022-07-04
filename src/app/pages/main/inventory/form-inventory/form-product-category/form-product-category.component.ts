import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { ImageOptions } from 'src/app/core/models/share/image.model';
import { ImagesService } from 'src/app/core/services/images/images.service';
import { InventoryService } from 'src/app/core/services/inventory/inventory.service';

@Component({
  selector: 'app-form-product-category',
  templateUrl: './form-product-category.component.html',
  styleUrls: ['./form-product-category.component.scss']
})
export class FormProductCategoryComponent implements OnInit {
  @Input() action: string;
  @Input() productCategory: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  nameEn: string;
  nameVi: string;
  imgUrl: string;
  imageData: string;
  form: FormGroup;
  // Config image
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
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    private inventorySvc: InventoryService,
    private imgSvc: ImagesService,
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this._createform();
  }

  private _createform() {
    this.form = this.fb.group({
      nameEn: ['', Validators.required],
      nameVi: ['', Validators.required],
      image: ['', Validators.required],
    });
    if (this.action === SystemConstant.ACTION.EDIT) {
      this._patchValue(this.productCategory);
    }
  }

  private async _uploadImage() {
    return await new Promise((resolve) => {
      if (this.imageData) {
        this.imgSvc.uploadImage(this.imageData, 'product-category').subscribe((res: any) => {
          if (res) {
            resolve(res.data.imageId);
            this.alert.success(res.message);
          }
        }, () => this.alert.error(this.translate.instant('FORM.UPLOAD_IMAGE_FAIL')));
      }
    });
  }

  private _patchValue(productCategory: any) {
    this.form.patchValue({
      nameEn: productCategory.nameEn,
      nameVi: productCategory.nameVi,
      image: productCategory.image,
    });
  }

  public dropzoneInit(event: any) {
    if (this.productCategory) {
      const imgOptions: ImageOptions = {
        id: this.productCategory.image
      };
      this.imgUrl = this.imgSvc.getImage(imgOptions);
      const mockFile = { name: "product_category_name", size: "50" };
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

  public onCancel(): void {
    this.closeModal.emit(false);
    this.activeModal.dismiss();
  }

  public async onSubmit() {
    this.spinner.show();
    const actionType = {
      CREATE: () => {
        this.inventorySvc.createProductCategory(this.form.value).subscribe(() => {
          this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
        }, () => this.spinner.hide());
      },
      EDIT: () => {
        this.inventorySvc.updateProductCategory(this.productCategory.id, this.form.value).subscribe(() => {
          this.alert.success(this.translate.instant('FORM.UPDATE_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
        }, () => this.spinner.hide());
      }
    };
    // Set data image after upload
    if (this.imageData) {
      const imageUploaded = await this._uploadImage();
      this.form.get('image').setValue(imageUploaded);
    }
    if (this.form.valid) {
      return actionType[this.action]();
    }
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
    this.spinner.hide();
  }


}
