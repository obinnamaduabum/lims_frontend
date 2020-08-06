import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../../service/dashboard.service';
import {ResponseModel} from '../../../../models/response-model';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  showEmailRequiredError = true;
  dashboardInfo: any;
  loading = true;
  constructor(private dashboardService: DashboardService) {}
  ngOnInit(): void {
    this.dashboardService.fetchPatientInfoDashboardInfo().subscribe(data => {
      const responseModel: ResponseModel = data;
      this.loading = false;
      if (responseModel.success) {
        this.dashboardInfo = responseModel.data;
      }
    }, error1 => {
      this.loading = false;
    });
  }
  toggleEmailRequiredError() {
    this.showEmailRequiredError = !this.showEmailRequiredError;
  }
}
