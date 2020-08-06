import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {ToastContainerDirective, ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'lims';

  loading = false;
  @ViewChild(ToastContainerDirective, { static: false }) toastContainer: ToastContainerDirective;

  constructor(private router: Router,
              private toastrService: ToastrService) {}

  scrollToTop() {
    window.scrollTo(0, 0);
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };
  }

  ngAfterViewInit() {
    this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this.loading = false;
          this.scrollToTop();
        }
      });
  }

  ngOnInit(): void {
    this.toastrService.overlayContainer = this.toastContainer;
  }
}
