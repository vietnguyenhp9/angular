import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Club } from 'src/app/core/models/share/club.model';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';

// import { ShareService } from 'src/app/core/services/share/share.service';
// import { getDataSelect } from 'src/app/core/utils';

@Component({
  selector: 'app-user-info-details',
  templateUrl: './user-info-details.component.html',
  styleUrls: ['./user-info-details.component.scss']
})
export class UserInfoDetailsComponent implements OnInit {
  @Input() userMemberInfo: UserProfile;
  @Input() toggleClubs: any;
  @Output() toggleClubsHide: EventEmitter<any> = new EventEmitter();
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  listClub: Club[] = [];

  constructor(
    // private shareSvc: ShareService,
    public translate: TranslateService,
    private authSvc: AuthenticationService
  ) { }
  checkPermission = false;
  openSelectBox = false;

  async ngOnInit() {
    const typePermission = [
      SystemConstant.PERMISSIONS.PU_CHANGEGMCLUB,
      SystemConstant.PERMISSIONS.PU_CHANGELEADERCLUB,
      SystemConstant.PERMISSIONS.PU_CHANGEPTCLUB
    ];
    this.checkPermission = this.authSvc.checkPermissions(typePermission);
    // this.listClub = await getDataSelect(this.shareSvc.getListClub());
  }


  public onChangeClub(selectedClub: any) {
    console.log('selectedClub: ', selectedClub);
    this.toggleClubs();
    this.toggleClubsHide.emit(this.toggleClubs);
  }

}
