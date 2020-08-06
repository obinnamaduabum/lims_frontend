import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-land-page-body',
  templateUrl: './land-page-body.component.html',
  styleUrls: ['./land-page-body.component.css']
})
export class LandPageBodyComponent implements OnInit {

  side: any = 'end';
  isSidebarOpen = false;
  constructor() { }

  ngOnInit(): void {
  }

  closeSidebar() {

  }
}
