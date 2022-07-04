import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { ImageOptions } from 'src/app/core/models/share/image.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { ImagesService } from 'src/app/core/services/images/images.service';
import { rotateImages } from 'src/app/core/utils';

@Component({
  selector: 'app-pt-leader-info-detail',
  templateUrl: './pt-leader-info-detail.component.html',
  styleUrls: ['./pt-leader-info-detail.component.scss']
})
export class PtLeaderInfoDetailComponent implements OnInit {

  constructor(
    private routerActive: ActivatedRoute,
    private imgSvc: ImagesService,
    private modalSvc: NgbModal
  ) { }

  userId: string;
  // Default value
  avatarUserDefault = '../../../../assets/images/admin/Avatar.png';
  userMemberInfo: UserProfile;
  avatarUser = '';
  formatDate = SystemConstant.TIME_FORMAT.DD_MM_YY;
  userIdentityCard = '';
  userIdentityCardDefault = '../../../assets/images/no-image.jpg';
  // tab Icon
  tabIcons = [
    'fas fa-user',
    'fas fa-money-bill',
    'fas fa-money-bill-wave',
    'fas fa-folder'
  ];
  // Tab Name 
  tabNames: any = [
    'TAB_MENU.INFORMATION',
    'TAB_MENU.REVENUE',
    'TAB_MENU.BONUS',
    'TAB_MENU.PT_LEADER_GROUP_HISTORY'
  ];

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

  public getPtLeaderInfoInfoFromChild(userInfo: UserProfile) {
    this.userMemberInfo = userInfo;
    if (this.userMemberInfo.avatar) {
      const avatar: ImageOptions = {
        id: this.userMemberInfo.avatar,
        width: 100,
        height: 100,
        format: 'png'
      };
      this.avatarUser = this.imgSvc.getImage(avatar);
    } else {
      this.avatarUser = this.avatarUserDefault;
    }
    // ---- //
    if (this.userMemberInfo.idCardImage) {
      const idCard: ImageOptions = {
        id: this.userMemberInfo.idCardImage,
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
}
