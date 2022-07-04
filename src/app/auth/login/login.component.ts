import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UrlConstant } from 'src/app/core/constants/url.constant';
import { AuthenticationService } from 'src/app/core/services/common/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  URL = UrlConstant.ROUTE.AUTH;
  username = '';
  password = '';
  showPass = false;

  constructor(
    private formBuilder: FormBuilder,
    private authSvc: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.createFormLogin();
  }

  public createFormLogin() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authSvc.login(this.loginForm.value);
  }

  public showPassword() {
    this.showPass = !this.showPass;
  }
}
