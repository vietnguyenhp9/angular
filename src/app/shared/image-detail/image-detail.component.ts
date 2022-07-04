import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.scss']
})
export class ImageDetailComponent implements OnInit {

  @Input() image: any;
  @Input() disable: any;


  hidden = '';

  rotationAmount = 0;
  styles: string;

  constructor() { }

  ngOnInit() {
    this.hidden =this.disable;
  }

  public rotateImage(direction) {
    const type = {
      left: 90,
      right: -90
    }
    this.rotationAmount = this.rotationAmount + type[direction];
    return this.styles = 'rotate(' + this.rotationAmount + 'deg)';
  }
}
