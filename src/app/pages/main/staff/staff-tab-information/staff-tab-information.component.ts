import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UserProfile } from 'src/app/core/models/share/user-profile.model';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-staff-tab-information',
  templateUrl: './staff-tab-information.component.html',
  styleUrls: ['./staff-tab-information.component.scss']
})
export class StaffTabInformationComponent implements OnInit {
  @Input() userId: string;
  @Output() getUserMemberInfo = new EventEmitter<UserProfile>();

  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;
  userMemberInfo: UserProfile;
  constructor(
    private spinner: NgxSpinnerService,
    private shareSvc: ShareService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this._getEmployeeInfo();
  }

  private _getEmployeeInfo() {
    this.spinner.show();
    this.shareSvc.getUserInfoById(this.userId).subscribe(async (res: any) => {
      this.getUserMemberInfo.emit(res.data);
      const [cityDetail, districtDetail] = await Promise.all([
        this._getCityDetailById(res.data.cityId),
        this._getDistrictDetailById(res.data.districtId),
      ]);
      this.userMemberInfo = {
        ...res.data,
        cityDetail, districtDetail
      };
      this.spinner.hide();
    }, () => this.spinner.hide());
  }

  private async _getCityDetailById(cityId: number) {
    if (cityId) {
      return await this.shareSvc.getCityDetailById(cityId)
        .toPromise().then((res: any) => res.data);
    }
  }

  private async _getDistrictDetailById(districtId: number) {
    if (districtId) {
      return await this.shareSvc.getDistrictDetailById(districtId)
        .toPromise().then((res: any) => res.data);
    }
  }
}
