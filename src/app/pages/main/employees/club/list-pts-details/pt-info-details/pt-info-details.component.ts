import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { ImageOptions } from 'src/app/core/models/share/image.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { ImagesService } from 'src/app/core/services/images/images.service';
import { rotateImages } from 'src/app/core/utils';

@Component({
  selector: 'app-pt-info-details',
  templateUrl: './pt-info-details.component.html',
  styleUrls: ['./pt-info-details.component.scss']
})
export class PtInfoDetailsComponent implements OnInit {
  userPtInfo: UserProfile;
  tabIcons = [
    'fas fa-user',
    'fas fa-file-contract',
    'fas fa-file-signature',
    'fas fa-cart-arrow-down',
    'fas fa-user-tag',
    'fas fa-people-arrows',
    'fas fa-calendar-check',
    'fas fa-history',
  ];
  tabNames: any = [
    'TAB_MENU.INFORMATION',
    'TAB_MENU.PT_CONTRACT',
    'TAB_MENU.PT_SESSION',
    'TAB_MENU.ACCESS_CONTROL',
    'TAB_MENU.BOOKINGS',
    'TAB_MENU.REVENUE',
    'TAB_MENU.BONUS',
    'TAB_MENU.PT_GROUP_HISTORY',
  ];
  userId: string;
  formatDate = SystemConstant.TIME_FORMAT.DD_MM_YY;
  avatarUser = '';
  avatarUserDefault = '../../../assets/images/admin/Avatar.png';
  userIdentityCard = '';
  userIdentityCardDefault = '../../../assets/images/no-image.jpg';

  constructor(
    private routerActive: ActivatedRoute,
    private imgSvc: ImagesService,
    private modalSvc: NgbModal
  ) { }

  ngOnInit(): void {
    this.userId = this.routerActive.snapshot.paramMap.get('id');
    this._getNameTab();
  }

  private _getNameTab() {
    this.tabNames = this.tabNames.map((item, index) => ({
      id: index + 1,
      name: item,
      template: item.toString().replace('TAB_MENU.', '').replace(/_/g, '').toLowerCase()
    }));
  }

  public getUserPtInfoFromChild(userInfo: UserProfile) {
    this.userPtInfo = userInfo;
    if (this.userPtInfo.avatar) {
      const avatar: ImageOptions = {
        id: this.userPtInfo.avatar,
        width: 100,
        height: 100,
        format: 'png'
      };
      this.avatarUser = this.imgSvc.getImage(avatar);
    } else {
      this.avatarUser = this.avatarUserDefault;
    }
    // ---- //
    if (this.userPtInfo.idCardImage) {
      const idCard: ImageOptions = {
        id: this.userPtInfo.idCardImage,
        width: 500,
        height: 500,
        format: 'png'
      };
      this.userIdentityCard = this.imgSvc.getImage(idCard);
    } else {
      this.userIdentityCard = this.userIdentityCardDefault;
    }
  }

  public openImage(image: any, type: string) {
    rotateImages(image, this.modalSvc, this.userIdentityCardDefault, type);
  }
};
