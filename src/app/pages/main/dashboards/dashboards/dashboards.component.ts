import { Component, OnInit } from '@angular/core';
import { Club } from 'src/app/core/models/share/club.model';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { ShareService } from 'src/app/core/services/share/share.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit {

  listClub: Club[] = [];
  userInfo: any;
  permissions: any[];
  isDashBoard = false;
  constructor(
    public shareSvc: ShareService,
    private authSvc: AuthenticationService,
  ) { }

  async ngOnInit() {
    this.getListClub();
    this._getUserInfo();
  }

  public getListClub() {
    this.shareSvc.getListClub().subscribe((res: any) => {
      this.listClub = res.data;
    });
  }

  private _getUserInfo() {
    this.userInfo = this.authSvc.getUserProfileLocal();
  }
}
