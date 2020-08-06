import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ToastrService} from 'ngx-toastr';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {LabTestOrdersService} from '../../../service/lab-test-orders-service';
import {ResponseModel} from '../../../models/response-model';
import {PortalAccountTypeConstant} from '../../../lh-enum/portal-account-type';
import {TestsSearchModel} from '../../../models/tests-search.model';
import {PageEvent} from '@angular/material/paginator';
import {LabTestOrderSearchModel} from '../../../models/lab-test-order-search-model';

@Component({
  selector: 'app-view-all-lab-tests-ordered',
  templateUrl: './view-all-lab-tests-ordered.component.html',
  styleUrls: ['./view-all-lab-tests-ordered.component.css']
})
export class ViewAllLabTestsOrderedComponent implements OnInit {

  labTestOrderReceiptList: any[] = [];
  loading = true;
  length: any;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  searchForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  panelOpenState = true;
  selected = 'ALL';
  sampleEnums: any[] = [
    {value: 'ALL', viewValue: 'All'},
    {value: 'SAMPLE_COLLECTED', viewValue: 'Sample Collected'},
    {value: 'SAMPLE_NOT_COLLECTED', viewValue: 'Sample Not Collected'}
  ];


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
      endDate: ['', []],
      sampleCollectedStatus: ['', []]
    });

    const labTestOrderSearchModel = new LabTestOrderSearchModel();
    labTestOrderSearchModel.startDate = '';
    labTestOrderSearchModel.enddate = '';

    this.labTestOrdersService.indexOflabTestsOrdered(labTestOrderSearchModel, 0, this.pageSize).subscribe(data => {
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

  redirectTo(id: any, accountType: string) {
    if (accountType.trim().toLocaleUpperCase() === PortalAccountTypeConstant.PATIENT) {
      this.router.navigateByUrl('/dashboard/lab/orders/' + id);
    } else {
      this.router.navigateByUrl('/dashboard/lab/orders/institution/' + id);
    }
  }


  search() {

    // console.log(this.searchForm.getRawValue());
    this.labTestOrdersService.indexOflabTestsOrdered(this.searchForm.getRawValue(), 0, this.pageSize).subscribe(data => {
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


    this.labTestOrdersService.indexOflabTestsOrdered(this.searchForm.getRawValue(), event.pageIndex, event.pageSize).subscribe(data => {

      console.log(data);

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



  updateSampleCollectionStatus(event, uniqueId: string, testId: any, orderId: any) {
    const itemIndex = this.labTestOrderReceiptList.findIndex(element => element.uniqueId === uniqueId);

    const value = {
      uniqueId,
      labTestId: testId
    };
    if (event.checked === true) {
      this.labTestOrdersService.updateSampleCollectionStatus(value, orderId).subscribe(data => {
        console.log(data);
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
          const item = this.labTestOrderReceiptList[itemIndex];
          console.log(item);
          item.sampleCollected = responseModel.data.sampleCollectionPojo;
          this.labTestOrderReceiptList[itemIndex] = item;
          this.showSuccess(responseModel.message);
        } else {
          this.showFailed(responseModel.message);
        }
      }, error1 => {
        this.showFailed(error1.error.message);
      });
    }
  }



  showSuccess(message: string) {
    this.toastService.success(message, 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }

  expansionClosed() {
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
