import { Component, OnInit } from '@angular/core';
import {Routes} from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: 'src/app/landing-page/landing-page/landing-page.component#LandingPageModule'},
];

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
