import {Component, ElementRef, HostBinding, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NavItem} from '../../custom-interface/nav-item-interface';
import {RoleTypeConstant} from '../../lh-enum/role-type';
import {AuthenticationService} from '../../service/authentication-service';
import {ResponseModel} from '../../models/response-model';
import {PortalUserModel} from '../../models/portal-user-model';


@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit {

  @ViewChild('plusMinusEffect', {static: false}) plusMinusEffect: ElementRef;
  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;
  roles: string[] = [];

  constructor(public router: Router,
              private authenticationService: AuthenticationService) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  onItemSelected(item: NavItem) {
    if (this.plusMinusEffect) {
      if (this.plusMinusEffect.nativeElement.classList) {
        if (this.plusMinusEffect.nativeElement.classList.contains('closed')) {
          this.plusMinusEffect.nativeElement.classList.remove('closed');
          this.plusMinusEffect.nativeElement.classList.add('opened');
        } else {
          this.plusMinusEffect.nativeElement.classList.remove('opened');
          this.plusMinusEffect.nativeElement.classList.add('closed');
        }
      }
    }

    if (!item.children || !item.children.length) {
      // this._router.navigate([item.route]);

      // this._resizeService.getResizeValue().subscribe(data => {
      //   if (data < 800) {
      //     this._leftSidebarService.close();
      //   }
      // }, error2 => {});
    }

    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  ngOnInit(): void {

    this.authenticationService.checkIfUserIsAlreadyLoggedIn().subscribe(data => {
      const responseModel: ResponseModel = data;
      // console.log(responseModel);
      if (responseModel) {
        const portalUser: PortalUserModel = responseModel.data;
       // console.log('xxxxxx');
        for (let i = 0; i < portalUser.portalAccountDescriptionDtoList.length; i++) {
          // console.log(portalUser.portalAccountDescriptionDtoList[i].roleName);
          this.roles.push(portalUser.portalAccountDescriptionDtoList[i].roleName);
        }
      }
    });
  }

  checkIfContainsRoles(roles: any[]) {
    // console.log('xxxx');
    // console.log('roles: ' + this.roles);
    if (roles && this.roles) {
      const cc = this.containsAny(roles, '[' + this.roles + ']');
      // console.log(cc);
      return cc;
      // console.log('allowed ' + roles);
      // // for (const x of this.roles) {
      // console.log('qqqqq: ' + this.roles);
      // const foundRoles = roles.includes(this.roles);
      // console.log('found ' + foundRoles);
      // return foundRoles;
      // }
     // return false;
    }
    return true;
  }


  containsAny(source, target) {
    const result = source.filter((item) => {
      return target.indexOf(item) > -1;
    });
    return (result.length > 0);
  }
}
