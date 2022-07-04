import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LanguageConstant } from 'src/app/core/constants/language.constant';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';
import { ConfirmedValidator } from 'src/app/core/validators/confirmed.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  URL = UrlConstant.ROUTE.AUTH;
  username = '';
  password = '';
  showPass = false;
  showPassConfirm = false;
  accountId: string;
  code: string;
  // Language
  currentLang = localStorage.getItem(SystemConstant.LANGUAGE) || 'en';
  // owPass = false;
  constructor(
    private formBuilder: FormBuilder,
    private authSvc: AuthenticationService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private alert: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.queryParams.subscribe((params) => {
      this.accountId = params.token;;
      this.code = params.code;
    });
  }

  public createForm() {
    this.form = this.formBuilder.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
      {
        validator: ConfirmedValidator('newPassword', 'confirmPassword'),
      });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.spinner.show();
      const body = {
        code: this.code,
        accountId: this.accountId,
        password: this.form.get('newPassword').value
      };
      this.authSvc.changePassword(body).subscribe((res) => {
        if (res) {
          this.alert.success(LanguageConstant[this.currentLang].LOGIN.CHANGE_PASS_SUCCESS);
          this.router.navigate([UrlConstant.ROUTE.AUTH.LOGIN]);
          this.spinner.hide();
        }
      }, () => this.spinner.hide());
      return;
    }
    this.alert.error(LanguageConstant[this.currentLang].ERROR.PASSWORD_INVALID);
  }

  public showPassword(type: string) {
    return type === 'newPassword'
      ? (this.showPass = !this.showPass)
      : (this.showPassConfirm = !this.showPassConfirm);
  }
}
