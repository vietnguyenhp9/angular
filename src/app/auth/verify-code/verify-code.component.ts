import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LanguageConstant } from 'src/app/core/constants/language.constant';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnInit {
  URL = UrlConstant.ROUTE.AUTH;
  accountId: string;
  emailPhoneForgotPass: string;
  code: string;
  isVerified = false;
  // Language
  currentLang = localStorage.getItem(SystemConstant.LANGUAGE) || 'en';
  // 
  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    private authSvc: AuthenticationService,
    private router: Router
  ) { }

  config = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '60px',
      'height': '50px'
    }
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.accountId = params.token;
    });
    this.emailPhoneForgotPass = sessionStorage.getItem('EmailPhoneForgotPass') || 'email/phone;';
  }

  public checkOtpCode(code: string) {
    this.code = code;
  }

  public onConfirm() {
    this.spinner.show();
    const body = {
      code: this.code,
      accountId: this.accountId
    };
    this.authSvc.checkOptCode(body).subscribe((res) => {
      if (res) {
        this.isVerified = true;
        this.code = this.code;
        this.router.navigate([UrlConstant.ROUTE.AUTH.CHANGE_PASSWORD], {
          queryParams: { token: this.accountId, code: this.code },
        });
        this.spinner.hide();
      }
    }, () => {
      this.alert.error(LanguageConstant[this.currentLang].ERROR.OTP_INVALID);
      this.spinner.hide();
    });
  }

}
