import { Component, OnInit } from '@angular/core';
import {Label} from 'ng2-charts';
import {ChartOptions, ChartType} from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import {ResponseModel} from '../../../models/response-model';
import {DashboardService} from '../../../service/dashboard.service';
import {ChartsService} from '../../../service/charts.service';
import {LabAccountDashboardInfo} from '../../../models/lab-account-dashboard-info';


@Component({
  selector: 'app-lab-dashboard',
  templateUrl: './lab-dashboard.component.html',
  styleUrls: ['./lab-dashboard.component.css']
})
export class LabDashboardComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  showPieChart = false;
  public pieChartLabels: Label[] = [['Tests by Patients'], 'Tests by Institutions'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(13, 71, 161, 1)', 'rgba(179, 12, 17, 1)', 'rgba(13, 71, 161, 1)'],
    },
  ];
  labAccountDashboardInfo: LabAccountDashboardInfo;
  loading = true;

  constructor(private chartsService: ChartsService,
              private dashboardService: DashboardService) { }

  ngOnInit() {

    this.chartsService.pieChartPatientVsInstitution().subscribe(data => {
      const responseModel: ResponseModel = data;
      this.loading = false;
      if (responseModel.success) {
        // const  pieChartPatientVsInstitutionModel: PieChartPatientVsInstitutionModel = responseModel.data;
        // console.log(pieChartPatientVsInstitutionModel);
        // const count: number[] = [];
        // if (pieChartPatientVsInstitutionModel.patientsNumberOfTests ||
        //   pieChartPatientVsInstitutionModel.institutionNumberOfTests) {
        //   this.showPieChart = true;
        // }
        // count.push(pieChartPatientVsInstitutionModel.patientsNumberOfTests);
        // count.push(pieChartPatientVsInstitutionModel.institutionNumberOfTests);
        // this.pieChartData = count;
      }
    }, error1 => {
      this.showPieChart = true;
      this.loading = false;
    });
    this.dashboardService.fetchLabAccountDashboardInfo().subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.labAccountDashboardInfo = responseModel.data;
      } else {
      }
    }, error1 => {});
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
