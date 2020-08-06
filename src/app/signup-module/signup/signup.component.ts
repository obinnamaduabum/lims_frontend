import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  reactJsApp: string;

  constructor() {
    if (environment.production) {
      this.reactJsApp = environment.reactAppUrl;
    } else {
      this.reactJsApp = environment.reactAppUrl;
    }
  }

  ngOnInit() {
  }

}
