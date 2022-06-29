import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
loginform!:FormGroup;
userName='';
password='';
  constructor(
    private formBuilder:FormBuilder,
    authSvc:AuthService
  ) { }

  ngOnInit(): void {
  }

  public createFormLogin(){
    this.loginform=this.formBuilder.group({
      userName:[''],
      password:['']
    })
  }
}
