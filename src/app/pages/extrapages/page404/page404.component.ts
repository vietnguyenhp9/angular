import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LanguageConstant } from 'src/app/core/constants/language.constant';
import { SystemConstant } from 'src/app/core/constants/system.constant';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})

export class Page404Component implements OnInit {
  languageConstant = LanguageConstant;
  currentLang = localStorage.getItem(SystemConstant.LANGUAGE) || 'en';
  // 
  constructor(
    public translate: TranslateService,
    private alert: ToastrService
  ) { }

  ngOnInit(): void {
    this.alert.error(LanguageConstant[this.currentLang].ERROR.YOU_DO_NOT_HAVE_PERMISSION);
  }

}
