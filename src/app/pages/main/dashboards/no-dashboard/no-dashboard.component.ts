import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-no-dashboard',
  templateUrl: './no-dashboard.component.html',
  styleUrls: ['./no-dashboard.component.scss']
})
export class NoDashboardComponent implements OnInit {

  constructor(
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.hide();
  }

}
