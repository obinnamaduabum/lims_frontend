import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ToastrService} from 'ngx-toastr';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {LabTestOrdersService} from '../../../service/lab-test-orders-service';
import {ResponseModel} from '../../../models/response-model';
import {TestsSearchModel} from '../../../models/tests-search.model';
import {PageEvent} from '@angular/material/paginator';
import {LabTestOrderSearchModel} from '../../../models/lab-test-order-search-model';

@Component({
  selector: 'app-view-sample-collection-stack',
  templateUrl: './view-sample-collection-stack.component.html',
  styleUrls: ['./view-sample-collection-stack.component.css']
})
export class ViewSampleCollectionStackComponent implements OnInit {

  labTestOrderReceiptList: any[] = [];
  loading = true;
  length: any;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  searchForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  panelOpenState = true;
  selected = 'ALL';


  constructor(private labTestOrdersService: LabTestOrdersService,
              private fb: FormBuilder,
              private router: Router,
              private cookieService: CookieService,
              private toastService: ToastrService) {
  }

  ngOnInit() {
    this.searchForm = this.fb.group({
      fullName: ['', []],
      email: ['', []],
      phoneNumber: ['', []],
      code: ['', []],
      orderId: ['', []],
      startDate: ['', []],
      endDate: ['', []]
    });

    const labTestOrderSearchModel = new LabTestOrderSearchModel();
    labTestOrderSearchModel.startDate = '';
    labTestOrderSearchModel.enddate = '';

    this.labTestOrdersService.findAllSamplesCollectedForMedicalLabScientist(labTestOrderSearchModel, 0, this.pageSize).subscribe(data => {
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


    if (this.cookieService.get('lab-test-ordered-expansionOpened')) {
      this.panelOpenState = true;
    } else {
      this.panelOpenState = false;
    }
  }


  clearStartDate() {
    this.searchForm.get('startDate').setValue('');
  }

  clearEndDate() {
    this.searchForm.get('endDate').setValue('');
  }

  redirectTo(id: any, labTestDetailId: any, medicalLabScientistSampleCollectedId: any, url: string) {
    console.log('labTestDetailId: ' + labTestDetailId);
    console.log('id: ' + id);
    console.log('medicalLabScientistSampleCollectedId: ' + medicalLabScientistSampleCollectedId);
    console.log('url: ' + url);

    this.router.navigate([url + id], {queryParams:
        { sampleId: labTestDetailId,
          medicalLabScientistId: medicalLabScientistSampleCollectedId}});
  }


  search() {

    // console.log(this.searchForm.getRawValue());
    this.labTestOrdersService.findAllSamplesCollectedForMedicalLabScientist(
      this.searchForm.getRawValue(),
      0,
      this.pageSize).subscribe(data => {
      console.log(data);
      this.loading = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        // console.log(responseModel);
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


    this.labTestOrdersService.findAllSamplesCollectedForMedicalLabScientist(
      this.searchForm.getRawValue(),
      event.pageIndex,
      event.pageSize).subscribe(data => {
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


  showSuccess(message: string) {
    this.toastService.success(message, 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }

  expansionClosed() {
    console.log('xxxxx');
    this.panelOpenState = false;
    this.cookieService.delete('lab-test-ordered-expansionOpened');
    this.cookieService.set('lab-test-ordered-expansionOpened', '');
  }

  expansionOpened() {
    console.log('open');
    this.panelOpenState = true;
    this.cookieService.delete('lab-test-ordered-expansionOpened');
    this.cookieService.set('lab-test-ordered-expansionOpened', 'true');
  }

}
