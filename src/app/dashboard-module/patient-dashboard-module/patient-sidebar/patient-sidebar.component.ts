import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavItem} from '../../../custom-interface/nav-item-interface';


@Component({
  selector: 'app-patient-sidebar',
  templateUrl: './patient-sidebar.component.html',
  styleUrls: ['./patient-sidebar.component.css']
})
export class PatientSidebarComponent implements OnInit {

  navItems: NavItem[] = [

    {
      displayName: 'Dashboard',
      showDivider: true,
      activeLinkOptions: true,
      route: '/dashboard/patient'
    },
    {
      displayName: 'Tests',
      showDivider: true,
      activeLinkOptions: true,
      route: '/dashboard/patient/tests'
    },
    {
      displayName: 'Invoice',
      showDivider: true,
      activeLinkOptions: true,
      route: '/dashboard/patient/receipt'
    },
    {
      displayName: 'Result',
      showDivider: true,
      activeLinkOptions: true,
      route: '/dashboard/patient/patient-result-list'
    }
  ];
  @ViewChild('appDrawer', {static: true}) appDrawer: ElementRef;
  @ViewChild('hamburgerIconTwo', {static: true})
  private hamburgerIcon: ElementRef;

  constructor() {}

  ngOnInit() {
    // this._dashboardLeftSidebarService.getSidebarStatus().subscribe(data => {
    //   if (data) {
    //     if (this.hamburgerIcon.nativeElement.classList) {
    //       this.hamburgerIcon.nativeElement.classList.add('is-active');
    //     }
    //   } else {
    //     if (this.hamburgerIcon.nativeElement.classList) {
    //       this.hamburgerIcon.nativeElement.classList.remove('is-active');
    //     }
    //   }
    // });
  }

  hamburgerIconClick() {
    this.toggleSidebar();
  }

  toggleSidebar() {
    // if (this.hamburgerIcon.nativeElement.classList) {
    //   if (this.hamburgerIcon.nativeElement.classList.contains('is-active')) {
    //     this.hamburgerIcon.nativeElement.classList.remove('is-active');
    //     this._dashboardLeftSidebarService.close();
    //   } else {
    //     this._dashboardLeftSidebarService.open();
    //     this.hamburgerIcon.nativeElement.classList.add('is-active');
    //   }
    // }
  }
}
