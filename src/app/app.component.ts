import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthenticationService } from './core/services/common/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(
    private permissionsService: NgxPermissionsService,
    private authSvc: AuthenticationService,
  ) { };

  ngOnInit(): void {
    if (this.authSvc.getUserProfileLocal()) {
      const userInfo = this.authSvc.getUserProfileLocal();
      this.permissionsService.loadPermissions(userInfo.permissions.concat(userInfo.systemPermissions));
    }
  }
}
