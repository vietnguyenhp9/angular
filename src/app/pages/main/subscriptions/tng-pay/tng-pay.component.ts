import { Component } from '@angular/core';

@Component({
  selector: 'app-tng-pay',
  templateUrl: './tng-pay.component.html',
  styleUrls: ['./tng-pay.component.scss']
})
export class TngPayComponent {

  isListTngPay = true;

  constructor() { }

  onChangeTab() {
    this.isListTngPay = !this.isListTngPay;
  }

}
