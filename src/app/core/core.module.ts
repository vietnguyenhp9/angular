import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/common/auth.service';
import { EventService } from './services/common/event.service';
import { LanguageService } from './services/common/language.service';

@NgModule({
  declarations: [],
  providers: [
    AuthenticationService,
    AuthGuard,
    NgxPermissionsGuard,
    LanguageService,
    EventService,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
  ],
  exports: [HttpClientModule, ToastrModule],
})
export class CoreModule {}
