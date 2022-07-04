import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { DROPZONE_CONFIG, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { ErrorClientHandler } from './core/middlewares/error-client-handler';
import { ErrorServerInterceptor } from './core/middlewares/error-server.interceptor';
import { JwtInterceptor } from './core/middlewares/jwt.interceptor';
import { LayoutsModule } from './layouts/layouts.module';
import { ExtrapagesModule } from './pages/extrapages/extrapages.module';
import { DashboardsModule } from './pages/main/dashboards/dashboards.module';
import { ImageDetailComponent } from './shared/image-detail/image-detail.component';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'https://httpbin.org/post',
  maxFilesize: 50,
  acceptedFiles: 'image/*',
};

export const pluginsModules = [
  ScrollToModule.forRoot(),
  NgxSpinnerModule,
  NgSelectModule,
];
@NgModule({
  declarations: [
    AppComponent,
    ImageDetailComponent,
  ],
  imports: [
    NgxPermissionsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
    AppRoutingModule,
    LayoutsModule,
    ExtrapagesModule,
    DashboardsModule,
    CoreModule,
    pluginsModules,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorServerInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: ErrorClientHandler,
    },
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
})
export class AppModule { }
