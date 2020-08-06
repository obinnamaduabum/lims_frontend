
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';

@Injectable()
export class PatientLeftSidebarService {
  private sidenav: MatSidenav;
  private sidebarStatus = new BehaviorSubject<boolean>(false);

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public open() {
    this.sidebarStatus.next(true);
    return this.sidenav.open();
  }


  public close() {
    this.sidebarStatus.next(false);
    return this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav.toggle();
  }


  public getSidebarStatus(): Observable<boolean> {
    return this.sidebarStatus.asObservable();
  }
}
