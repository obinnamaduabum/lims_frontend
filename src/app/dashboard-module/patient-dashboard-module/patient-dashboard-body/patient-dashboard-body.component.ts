import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {PatientLeftSidebarService} from '../../../service/patient-left-sidebar.service';
import {PrintService} from '../../../service/print.service';


@Component({
  selector: 'app-patient-dashboard-body',
  templateUrl: './patient-dashboard-body.component.html',
  styleUrls: ['./patient-dashboard-body.component.css']
})
export class PatientDashboardBodyComponent implements OnInit {
  mode = 'side';
  private desktopWidth = 800;
  @ViewChild('patientLeftSidenav', { static: true })
  public leftSideNav: MatSidenav;
  currentWidth: number;
  isSidebarOpen = false;
  printStatus = false;

  constructor(private patientLeftSidebarService: PatientLeftSidebarService,
              private printService: PrintService) {}

  ngOnInit() {
    this.patientLeftSidebarService.setSidenav(this.leftSideNav);


    this.patientLeftSidebarService.getSidebarStatus().subscribe(data => {
      // console.log(this.mode);
      if (data) {
        this.isSidebarOpen = this.mode === 'over';
      } else {
        this.isSidebarOpen = false;
      }
    }, error1 => {});

    this.currentWidth = window.innerWidth;
    this.checkWidthAndSetMode();
    this.printService.printingStatus.subscribe(data => {
      this.printStatus = data;
      if (this.printStatus) {
        this.patientLeftSidebarService.close();
      }
    }, error1 => {});
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.currentWidth = event.target.innerWidth;
    this.checkWidthAndSetMode();
  }
  checkWidthAndSetMode() {
    if (this.currentWidth > this.desktopWidth) {
      this.setAsSideMode();
    } else {
      this.setAsOverMode();
    }
  }
  setAsSideMode() {
    this.mode = 'side';
    this.patientLeftSidebarService.open();
  }
  setAsOverMode() {
    this.mode = 'over';
    this.patientLeftSidebarService.close();
  }

  closeSidebar() {
    this.patientLeftSidebarService.close();
  }
}
