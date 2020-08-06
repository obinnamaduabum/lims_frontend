import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavItem} from '../../../custom-interface/nav-item-interface';
import {AuthenticationService} from '../../../service/authentication-service';
import {RoleTypeConstant} from '../../../lh-enum/role-type';


@Component({
  selector: 'app-lab-sidebar',
  templateUrl: './lab-sidebar.component.html',
  styleUrls: ['./lab-sidebar.component.css']
})
export class LabSidebarComponent implements OnInit {

  navItems: NavItem[] = [];
  @ViewChild('appDrawer', {static: true}) appDrawer: ElementRef;
  @ViewChild('hamburgerIconTwo', {static: true})
  private hamburgerIcon: ElementRef;
  roles: any[] = [];

  constructor(private authenticationService: AuthenticationService) {}

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

    this.navItems = [
      {
        displayName: 'Dashboard',
        showDivider: true,
        activeLinkOptions: true,
        route: '/dashboard/lab',
      },
      {
        displayName: 'Orders',
        showDivider: true,
        activeLinkOptions: true,
        route: '/dashboard/lab/orders',
        rolesAllowedToView: [RoleTypeConstant.RECEPTIONIST, RoleTypeConstant.ADMIN],
      },
      {
        displayName: 'Sample Status',
        showDivider: true,
        activeLinkOptions: true,
        route: '/dashboard/lab/orders/lab-tests-ordered',
        rolesAllowedToView: [RoleTypeConstant.RECEPTIONIST, RoleTypeConstant.ADMIN],
      },
      {
        displayName: 'Tasks',
        showDivider: true,
        activeLinkOptions: true,
        route: '/dashboard/lab/medical-lab-scientist/tasks',
        rolesAllowedToView: [RoleTypeConstant.ADMIN, RoleTypeConstant.SUPER_ADMIN, RoleTypeConstant.MEDICAL_LAB_SCIENTIST],
      },
      {
        displayName: 'Lab Tests',
        showDivider: true,
        activeLinkOptions: true,
        rolesAllowedToView: [RoleTypeConstant.ADMIN, RoleTypeConstant.SUPER_ADMIN],
        children: [
          // {
          //   displayName: 'Create',
          //   route: '/dashboard/lab/lab-tests/create-test'
          // },
          {
            displayName: 'Upload Tests',
            route: '/dashboard/lab/lab-tests/upload-test'
          }
        ]
      },
      {
        displayName: 'Settings',
        showDivider: true,
        activeLinkOptions: true,
        rolesAllowedToView: [RoleTypeConstant.ADMIN, RoleTypeConstant.SUPER_ADMIN],
        children: [
          {
            displayName: 'Main',
            showDivider: true,
            activeLinkOptions: true,
            route: '/dashboard/lab/settings/main'
          },
          {
            displayName: 'Payment',
            showDivider: true,
            activeLinkOptions: true,
            children: [
              // {
              //   displayName: 'Create',
              //   route: '/dashboard/lab/settings/payment/create'
              // },
              // {
              //   displayName: 'Edit',
              //   route: '/dashboard/lab/settings/payment/edit'
              // },
              {
                displayName: 'View All',
                route: '/dashboard/lab/settings/payment/view-all'
              }
            ]
          }
        ]
      },
      {
        displayName: 'Manage Users',
        showDivider: true,
        activeLinkOptions: true,
        rolesAllowedToView: [RoleTypeConstant.SUPER_ADMIN],
        children: [
          {
            displayName: 'Create Employee',
            showDivider: true,
            activeLinkOptions: true,
            route: '/dashboard/lab/manage-users/create-employee'
          },
          {
            displayName: 'View all users',
            showDivider: true,
            activeLinkOptions: true,
            route: '/dashboard/lab/manage-users/view-all-users'
          },
          {
            displayName: 'Topic',
            showDivider: true,
            activeLinkOptions: true,
            route: '/dashboard/lab/manage-users/topic'
          }
        ]
      },
      {
        displayName: 'Lab Test Template',
        showDivider: true,
        activeLinkOptions: true,
        rolesAllowedToView: [RoleTypeConstant.ADMIN,
          RoleTypeConstant.SUPER_ADMIN,
          RoleTypeConstant.MEDICAL_LAB_SCIENTIST,
          RoleTypeConstant.PATHOLOGIST],
        children: [
          {
            displayName: 'Create',
            showDivider: true,
            activeLinkOptions: true,
            route: '/dashboard/lab/lab-test-template/create'
          },
          {
            displayName: 'View All',
            showDivider: true,
            activeLinkOptions: true,
            route: '/dashboard/lab/lab-test-template'
          }
        ]
      },
      {
        displayName: 'Medical Lab Scientist',
        showDivider: true,
        activeLinkOptions: true,
        rolesAllowedToView: [
          RoleTypeConstant.ADMIN,
          RoleTypeConstant.SUPER_ADMIN,
          RoleTypeConstant.MEDICAL_LAB_SCIENTIST,
          RoleTypeConstant.PATHOLOGIST],
        children: [
          {
            displayName: 'Create Result',
            showDivider: true,
            activeLinkOptions: true,
            route: '/dashboard/lab/medical-lab-scientist'
          }
        ]
      },
    ];
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
