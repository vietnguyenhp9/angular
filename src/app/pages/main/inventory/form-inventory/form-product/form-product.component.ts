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
import { ShareService } from 'src/app/core/services/share/share.service';
import { getDataSelect } from 'src/app/core/utils';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss']
})
export class FormProductComponent implements OnInit {
  @Input() action: string;
  @Input() Product: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  form: FormGroup;
  formValue: any;
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
  // List 
  listClub = [];
  productDetail = [];
  listProductCategory = [];
  // Field input 
  nameEn: string;
  nameVi: string;
  sellingPrice: string;
  unit: number;
  categoryId: number;
  clubIds: string[] = [''];
  isAllClub: string[] = [];
  imageData: string;
  imageUrl: string;
  show = true;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    private inventorySvc: InventoryService,
    private shareSvc: ShareService,
    private imgSvc: ImagesService,
    public translate: TranslateService,

  ) { }

  async ngOnInit() {
    this._createform();
    this.listClub = await getDataSelect(this.shareSvc.getListClub());
    this.listProductCategory = await getDataSelect(this.inventorySvc.getListProductCategory());
  }

  private _getDetailProduct() {
    this.inventorySvc.getProductDetail(this.Product.id).subscribe((res: any) => {
      this.productDetail = res.data;
      this._patchValue(res.data);
    });
  }

  private _createform() {
    this.form = this.fb.group({
      nameEn: ['', Validators.required],
      nameVi: ['', Validators.required],
      sellingPrice: ['', Validators.required],
      unit: ['', Validators.required],
      categoryId: [null, Validators.required],
      clubIds: [null],
      isAllClub: [null],
      image: ['', Validators.required],
    });
    if (this.action === SystemConstant.ACTION.EDIT) {
      this._getDetailProduct();
    }
  }

  private _patchValue(productDetail: any) {
    this.form.patchValue({
      nameEn: productDetail.nameEn,
      nameVi: productDetail.nameVi,
      image: productDetail.image,
      sellingPrice: productDetail.sellingPrice,
      unit: productDetail.unit,
      categoryId: productDetail.categoryId,
      isAllClub: productDetail.isAllClub,
      clubIds: productDetail.clubIds.map(item => parseInt(item))
    });
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

  public selectAllClub(event: any) {
    if (event.target.checked) {
      const selectedClub = this.listClub.map(item => item.id);
      return this.form.get('clubIds').patchValue(selectedClub);
    }
    this.form.get('clubIds').setValue(null);
  }

  public async onSubmit() {
    this.spinner.show();
    const actionType = {
      CREATE: () => {
        this.inventorySvc.createProduct(this.formValue).subscribe(() => {
          this.alert.success(this.translate.instant('FORM.ADD_SUCCESS'));
          this.closeModal.emit(true);
          this.activeModal.dismiss();
        }, () => this.spinner.hide());
      },
      EDIT: () => {
        this.inventorySvc.updateProduct(this.Product.id, this.formValue).subscribe(() => {
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
      this.formValue = {
        info: {
          nameEn: this.form.controls.nameEn.value,
          nameVi: this.form.controls.nameVi.value,
          image: this.form.controls.image.value,
          sellingPrice: this.form.controls.sellingPrice.value,
          unit: this.form.controls.unit.value,
          categoryId: this.form.controls.categoryId.value,
          isAllClub: this.form.controls.isAllClub.value,
        },
        clubIds: this.form.controls.clubIds.value,
      };
      return actionType[this.action]();
    }
    this.alert.error(this.translate.instant('FORM.FORM_NOT_VALID'));
    this.spinner.hide();
  }

  public dropzoneInit(event: any) {
    if (this.Product) {
      const imgOptions: ImageOptions = {
        id: this.Product.image
      };
      this.imageUrl = this.imgSvc.getImage(imgOptions);
      const mockFile = {
        name: "product_name", size: "150"
      };
      event.emit("addedfile", mockFile);
      event.emit("thumbnail", mockFile, this.imageUrl);
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


}
