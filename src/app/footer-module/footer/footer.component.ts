import { Component, OnInit } from '@angular/core';
import {InfoModel} from '../../models/info_model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  infoList: InfoModel[] = [
    {
      imgUrl: 'assets/images/png/call-answer-white.png',
      value: '+2348067189966',
      imgName: 'phone'
    }, {
      imgUrl: 'assets/images/png/envelope-white.png',
      value: 'obinnamaduabum@gmail.com',
      imgName: 'email'
    },
     {
      imgUrl: 'assets/images/png/envelope-white.png',
      value: 'obinnamaduabum@gmail.com',
      imgName: 'email'
    }
  ];

  constructor() { }

  ngOnInit(): void {

  }

}
