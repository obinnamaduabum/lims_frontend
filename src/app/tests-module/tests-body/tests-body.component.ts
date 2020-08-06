import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatSidenav} from '@angular/material/sidenav';
import {MainLeftSidebarService} from '../../service/main-left-sidebar.service';

@Component({
  selector: 'app-tests-body',
  templateUrl: './tests-body.component.html',
  styleUrls: ['./tests-body.component.css']
})
export class TestsBodyComponent implements OnInit {

  side: any = 'end';
  public lottieConfig: object;
  anim: any;
  animationSpeed = 1;
  mode: string;
  private desktopWidth = 800;
  @ViewChild('leftSideNav', {static: true})
  public leftSideNav: MatSidenav;
  currentWidth: number;
  isSidebarOpen = false;

  constructor(private router: Router, private mainLeftSidebarService: MainLeftSidebarService) {
    this.lottieConfig = {
      path: 'assets/lottie/4339-not-found.json',
      autoplay: true,
      loop: true
    };
  }

  ngOnInit(): void {

    this.mainLeftSidebarService.setSidenav(this.leftSideNav);
    this.mainLeftSidebarService.getSidebarStatus().subscribe(data => {
      // console.log(this.mode);
      if (data) {
        this.isSidebarOpen = this.mode === 'over';
      } else {
        this.isSidebarOpen = false;
      }
    }, error1 => {
    });
    this.currentWidth = window.innerWidth;
    // this.checkWidthAndSetMode();
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  pause() {
    this.anim.pause();
  }

  setSpeed(speed: number) {
    this.animationSpeed = speed;
    this.anim.setSpeed(speed);
  }

  redirect(s: string) {
    this.router.navigate([s]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.currentWidth = event.target.innerWidth;
    this.checkWidthAndSetMode();
  }

  checkWidthAndSetMode() {
    if (this.currentWidth > this.desktopWidth) {
      this.setAsSideMode();
    }
  }

  setAsSideMode() {
    this.mode = 'over';
    this.mainLeftSidebarService.close();
  }

  setAsOverMode() {
    this.mode = 'over';
    this.mainLeftSidebarService.close();
  }

  closeSidebar() {
    this.mainLeftSidebarService.close();
  }
}
