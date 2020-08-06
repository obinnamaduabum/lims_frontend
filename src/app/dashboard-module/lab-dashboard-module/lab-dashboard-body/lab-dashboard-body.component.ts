import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {PrintService} from '../../../service/print.service';
import {LabLeftSidebarService} from '../../../service/lab-left-sidebar.service';


@Component({
  selector: 'app-lab-dashboard-body',
  templateUrl: './lab-dashboard-body.component.html',
  styleUrls: ['./lab-dashboard-body.component.css']
})
export class LabDashboardBodyComponent implements OnInit {

  mode: string;
  private desktopWidth = 800;
  @ViewChild('patientLeftSidenav', { static: true })
  public leftSideNav: MatSidenav;
  currentWidth: number;
  isSidebarOpen = false;
  printStatus = false;
  constructor(private labLeftSidebarService: LabLeftSidebarService,
              private printService: PrintService) {}

  ngOnInit() {
    this.labLeftSidebarService.setSidenav(this.leftSideNav);

    this.labLeftSidebarService.getSidebarStatus().subscribe(data => {
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
        this.labLeftSidebarService.close();
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
    this.labLeftSidebarService.open();
  }
  setAsOverMode() {
    this.mode = 'over';
    this.labLeftSidebarService.close();
  }

  closeSidebar() {
    this.labLeftSidebarService.close();
  }
}
