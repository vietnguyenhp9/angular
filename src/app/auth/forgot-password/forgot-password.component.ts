import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  URL = UrlConstant.ROUTE.AUTH;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private alert: ToastrService,
    private authSvc: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      userName: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.spinner.show();
    const body = {
      username: this.form.get('userName').value,
      type: 'OTP'
    };
    this.authSvc.forgotPassword(body).subscribe((res: any) => {
      if (res) {
        this.alert.success("Please Check Your Email Or Sms For Get Verify Code !");
        this.router.navigate([UrlConstant.ROUTE.AUTH.VERIFY_CODE],
          {
            queryParams: { token: res.data.accountId },
          });
        sessionStorage.setItem('EmailPhoneForgotPass', this.form.get('userName').value);
        this.spinner.hide();
      }
    }, () => this.spinner.hide());

  }
}
