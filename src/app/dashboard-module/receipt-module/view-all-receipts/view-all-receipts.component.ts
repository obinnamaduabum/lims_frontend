import { Component, OnInit } from '@angular/core';
import {LabTestOrderReceiptModel} from '../../../models/lab-test-order-receipt.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {LabTestOrdersService} from '../../../service/lab-test-orders-service';
import {Router} from '@angular/router';
import {ReportService} from '../../../service/report.service';
import {AuthenticationService} from '../../../service/authentication-service';
import {ResponseModel} from '../../../models/response-model';
import {PortalUserModel} from '../../../models/portal-user-model';
import {PortalAccountTypeConstant} from '../../../lh-enum/portal-account-type';
import {PageEvent} from '@angular/material/paginator';
import {TestsSearchModel} from '../../../models/tests-search.model';
import {LabTestOrderSearchModel} from '../../../models/lab-test-order-search-model';


@Component({
  selector: 'app-view-all-receipts',
  templateUrl: './view-all-receipts.component.html',
  styleUrls: ['./view-all-receipts.component.css']
})
export class ViewAllReceiptsComponent implements OnInit {

  labTestOrderReceiptList: LabTestOrderReceiptModel[] = [];
  loading = true;
  length: any;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  searchForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  isPatient = false;


  constructor(private labTestOrdersService: LabTestOrdersService,
              private fb: FormBuilder,
              private router: Router,
              private reportService: ReportService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {

    this.searchForm = this.fb.group({
      code: ['', []],
      startDate: ['', []],
      endDate: ['', []],
    });

    const labTestOrderSearchModel = new LabTestOrderSearchModel();
    labTestOrderSearchModel.startDate = '';
    labTestOrderSearchModel.enddate = '';

    this.labTestOrdersService.forSpecificUser(labTestOrderSearchModel, 0, this.pageSize).subscribe(data => {

      // console.log(data);

      this.loading = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        console.log(responseModel);
        this.labTestOrderReceiptList = responseModel.data.dataList;
        this.length = responseModel.data.length;
      } else {
      }
    }, error1 => {

      this.loading = false;
    });


    this.authenticationService.getUserInfo().subscribe(data => {
      // console.log(data);
      const responseModel: ResponseModel = data;
      if (responseModel) {
        const portalUser: PortalUserModel = responseModel.data;
        console.log(portalUser);
        portalUser.portalAccountDescriptionDtoList.filter(value => {
          if (value.portalAccountTypeConstant === PortalAccountTypeConstant.LAB.toString()) {
            this.isPatient = false;
          } else if (value.portalAccountTypeConstant === PortalAccountTypeConstant.PATIENT.toString()) {
            this.isPatient = true;
          }
        });
      }
    }, error1 => {
    });
  }


  clearStartDate() {
    this.searchForm.get('startDate').setValue('');
  }

  clearEndDate() {
    this.searchForm.get('endDate').setValue('');
  }

  redirectTo(id: any) {
    this.router.navigateByUrl('/dashboard/patient/receipt/' + id);
  }
  search() {
    this.labTestOrdersService.forSpecificUser(this.searchForm.getRawValue(), 0, this.pageSize).subscribe(data => {
      console.log(data);
      this.loading = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        console.log(responseModel);
        this.labTestOrderReceiptList = responseModel.data.dataList;
        this.length = responseModel.data.length;
      } else {
      }
    }, error1 => {

      this.loading = false;
    });
  }
  switchPage(event: PageEvent) {
    this.loading = true;
    const testSearchModel: TestsSearchModel = new TestsSearchModel();
    // if (this.searchForm.get('testName').value) {
    //   testSearchModel.searchValue = this.searchForm.get('testName').value;
    // }
    //
    // if (this.searchForm.get('categoryName').value) {
    //   testSearchModel.categoryName = this.searchForm.get('categoryName').value;
    // }


    this.labTestOrdersService.forSpecificUser(this.searchForm.getRawValue(), event.pageIndex, event.pageSize).subscribe(data => {

      console.log(data);

      this.loading = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        console.log(responseModel);
        this.labTestOrderReceiptList = responseModel.data.dataList;
        this.length = responseModel.data.length;
      } else {
      }
    }, error1 => {

      this.loading = false;
    });
  }


  downloadReceipt(id: any) {
    if (this.isPatient) {
      this.reportService.downloadPatientReceiptPDF(id, 'PDF');
    } else {
      this.reportService.downloadPatientReceiptPDFForAdmin(id, 'PDF');
    }
  }
}
