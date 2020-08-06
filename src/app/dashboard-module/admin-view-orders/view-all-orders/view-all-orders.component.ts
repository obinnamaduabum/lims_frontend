import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {LabTestOrdersService} from '../../../service/lab-test-orders-service';
import {PortalAccountTypeConstant} from '../../../lh-enum/portal-account-type';
import {PageEvent} from '@angular/material/paginator';
import {TestsSearchModel} from '../../../models/tests-search.model';
import {ResponseModel} from '../../../models/response-model';
import {LabTestOrderReceiptModel} from '../../../models/lab-test-order-receipt.model';
import {LabTestOrderSearchModel} from '../../../models/lab-test-order-search-model';

@Component({
  selector: 'app-view-all-orders',
  templateUrl: './view-all-orders.component.html',
  styleUrls: ['./view-all-orders.component.css']
})
export class ViewAllOrdersComponent implements OnInit {

  labTestOrderReceiptList: LabTestOrderReceiptModel[] = [];
  loading = true;
  length: any;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  searchForm: FormGroup;
  matcher = new MyErrorStateMatcher();


  constructor(private labTestOrdersService: LabTestOrdersService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit() {

    this.searchForm = this.fb.group({
      code: ['', []],
      startDate: ['', []],
      endDate: ['', []],
    });

    const labTestOrderSearchModel = new LabTestOrderSearchModel();
    labTestOrderSearchModel.startDate = '';
    labTestOrderSearchModel.enddate = '';

    this.labTestOrdersService.index(labTestOrderSearchModel, 0, this.pageSize).subscribe(data => {

      this.loading = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        console.log(responseModel.data.dataList);
        this.labTestOrderReceiptList = responseModel.data.dataList;
        this.length = responseModel.data.length;
      } else {
      }
    }, error1 => {

      this.loading = false;
    });
  }


  clearStartDate() {
    this.searchForm.get('startDate').setValue('');
  }

  clearEndDate() {
    this.searchForm.get('endDate').setValue('');
  }

  redirectTo(id: any, accountType: string) {
    if (accountType.trim().toLocaleUpperCase() === PortalAccountTypeConstant.PATIENT) {
      this.router.navigateByUrl('/dashboard/lab/orders/' + id);
    } else {
      this.router.navigateByUrl('/dashboard/lab/orders/institution/' + id);
    }
  }


  search() {
    this.labTestOrdersService.index(this.searchForm.getRawValue(), 0, this.pageSize).subscribe(data => {
      this.loading = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
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


    this.labTestOrdersService.index(this.searchForm.getRawValue(), event.pageIndex, event.pageSize).subscribe(data => {
      this.loading = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.labTestOrderReceiptList = responseModel.data.dataList;
        this.length = responseModel.data.length;
      } else {
      }
    }, error1 => {

      this.loading = false;
    });
  }
}
