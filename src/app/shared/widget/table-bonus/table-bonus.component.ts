import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SystemConstant } from 'src/app/core/constants/system.constant';

@Component({
  selector: 'app-table-bonus',
  templateUrl: './table-bonus.component.html',
  styleUrls: ['./table-bonus.component.scss']
})
export class TableBonusComponent {
  @Input() listData: any;
  dayFormat = SystemConstant.TIME_FORMAT.DD_MM_YY;

  constructor(
    public translate: TranslateService
  ) { }

}
