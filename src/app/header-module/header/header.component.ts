import { Component, OnInit } from '@angular/core';
import {MyCookieService} from '../../service/mycookieservice.service';
import {CookieService} from 'ngx-cookie-service';
import {MainLeftSidebarService} from '../../service/main-left-sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  itemsInCart: any [] = [];
  constructor(private mainLeftSidebarService: MainLeftSidebarService,
              private cookieService: CookieService,
              private myCookieService: MyCookieService) { }

  ngOnInit(): void {
    this.myCookieService.getShoppingCartList().subscribe(data => {
      console.log(data);
      this.itemsInCart = data;
    }, error1 => {});

    this.mainLeftSidebarService.getSidebarStatus().subscribe(data => {
      // if (!data) {
      //   this.hamburgerIcon.nativeElement.classList.remove('is-active');
      // } else {
      //   this.hamburgerIcon.nativeElement.classList.add('is-active');
      // }
    }, error1 => {});

    this.cookieService.get('items-in-cart');
  }

  redirect() {

  }

  hamburgerIconClick() {

  }
}
