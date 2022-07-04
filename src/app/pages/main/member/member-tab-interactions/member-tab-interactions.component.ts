import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { isNil, omitBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemConstant } from 'src/app/core/constants/system.constant';
import { Query } from 'src/app/core/models/share/query.model';
import { MemberService } from 'src/app/core/services/member/member.service';

import {
  FormAddNoteInteractionsComponent,
} from '../form-members/form-add-note-interactions/form-add-note-interactions.component';

@Component({
  selector: 'app-member-tab-interactions',
  templateUrl: './member-tab-interactions.component.html',
  styleUrls: ['./member-tab-interactions.component.scss']
})
export class MemberTabInteractionsComponent implements OnInit {
  @Input() userId: string;
  listNote = [];
  timeFormat = SystemConstant.TIME_FORMAT;

  constructor(
    private spinner: NgxSpinnerService,
    private memberSvc: MemberService,
    public translate: TranslateService,
    private modalSvc: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getMemberInteractions();
  }


  public addNotes() {
    const modalRef = this.modalSvc.open(
      FormAddNoteInteractionsComponent, {
      centered: true,
      size: 'md',
      backdrop: true,
    });
    modalRef.componentInstance.userId = this.userId;
    modalRef.componentInstance.closeModal.subscribe((res) => {
      return res?this.getMemberInteractions({ accountId: this.userId }):{};
    });
  }

  public getMemberInteractions(options?: Query) {
    this.spinner.show();
    options = {
      accountId: this.userId,
    };
    this.memberSvc.getMemberInteractions(omitBy(options, isNil)).subscribe((res: any) => {
      this.listNote = res.data;
      this.spinner.hide();
    }, () => this.spinner.hide());
  }
}
