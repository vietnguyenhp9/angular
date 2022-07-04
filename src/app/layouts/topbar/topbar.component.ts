import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { LanguageService } from 'src/app/core/services/common/language.service';
import { AuthenticationService } from '../../core/services/common/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

/**
 * Topbar component
 */
export class TopbarComponent implements OnInit {

  element: any;
  langValue: any;
  flagvalue: any;
  countryName: any;
  valueset: any;
  // 
  userInfo: any;
  // 
  toggleCss = false;

  constructor
    (
      @Inject(DOCUMENT) private document: any,
      public languageSvc: LanguageService,
      public translate: TranslateService,
      private authSvc: AuthenticationService,
  ) {
  }

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'VietNam', flag: 'assets/images/flags/vn.png', lang: 'vi' },
  ];

  openMobileMenu: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.openMobileMenu = false;
    this.element = document.documentElement;
    this.langValue = localStorage.getItem(SystemConstant.LANGUAGE) || 'en';
    const val = this.listLang.filter(x => x.lang === this.langValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
    // 
    this._getUserInfoLocal();
  }

  private _getUserInfoLocal() {
    this.userInfo = this.authSvc.getUserProfileLocal();
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langValue = lang;
    this.languageSvc.setLanguage(lang);
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
    this.toggleCss = !this.toggleCss;
  }

  /**
   * Logout the user
   */
  logout() {
    this.authSvc.logout();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}
