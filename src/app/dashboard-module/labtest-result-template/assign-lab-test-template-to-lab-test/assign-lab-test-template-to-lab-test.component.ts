import { Component, OnInit } from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminSettingsModel} from '../../../models/admin-settings-model';
import {LabTestCategoriesService} from '../../../service/lab-test-categories.service';
import {MyCookieService} from '../../../service/mycookieservice.service';
import {AdminSettingsService} from '../../../service/admin-settings-service';
import {GraphqlService} from '../../../service/graphql-service';
import {TestsSearchModel} from '../../../models/tests-search.model';
import {ResponseModel} from '../../../models/response-model';
import {PaginationModel} from '../../../models/pagination.model';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-assign-lab-test-template-to-lab-test',
  templateUrl: './assign-lab-test-template-to-lab-test.component.html',
  styleUrls: ['./assign-lab-test-template-to-lab-test.component.css']
})
export class AssignLabTestTemplateToLabTestComponent implements OnInit {


  testCategories: any[] = [];
  filteredTestCategories: any[] = [];
  loading = true;
  public lottieConfig: object;
  adminSettingsModel: AdminSettingsModel;
  mode: string;
  searchForm: FormGroup;
  length;
  pageSize = 8;
  pageNumber = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  categories: any[] = [];
  labTests: any[] = [];
  fetchingLatTests = false;
  selectedCategory: any;
  selectedLabTest: any;
  private code: string;
  histories: any[] = [];

  constructor(private labTestCategoriesService: LabTestCategoriesService,
              private myCookieService: MyCookieService,
              private fb: FormBuilder,
              private adminSettingsService: AdminSettingsService,
              private graphqlService: GraphqlService,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastrService) {
  }

  ngOnInit() {

    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    console.log(this.code);
    this.searchForm = this.fb.group({
      categoryName: ['', []],
      testName: ['', []],
      labTest: ['', [ Validators.required]],
      labTestCategory: ['', [ Validators.required]]
    });

    this.fetchCategories();

    this.searchForm.get('testName').valueChanges.pipe(debounceTime(200),
      distinctUntilChanged()).subscribe(input => {
      const testSearchModel: TestsSearchModel = new TestsSearchModel();
      if (input) {
        testSearchModel.searchValue = input;
      }
      if (this.searchForm.get('categoryName').value) {
        testSearchModel.categoryName = this.searchForm.get('categoryName').value;
      }

      this.labTestCategoriesService.filteredSearchLabCategoriesAndTests(testSearchModel, 0, this.pageSize).subscribe(data => {
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
          const paginationModel: PaginationModel = responseModel.data;
          this.filteredTestCategories = paginationModel.dataList;
          // this.setPageInfo(paginationModel);
        } else {
          this.filteredTestCategories = [];
        }
      });
    });


    this.fetchAssignmentHistory(this.code);
  }


  fetchCategories() {
    this.loading = true;
    this.labTestCategoriesService.getLabCategories().subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.loading = false;
        this.categories = responseModel.data;
        console.log(responseModel.data);
        // this.setPageInfo(paginationModel);
      }
    }, error1 => {});
  }

  onSelectionChange(event: any) {

    // console.log(event.value);
    const categoryId = event.value;
    this.selectedCategory = categoryId;
    // console.log(categoryId);
    this.fetchingLatTests = true;
    this.labTestCategoriesService.getLabTestsFromLabCategories(categoryId).subscribe(data => {
      this.fetchingLatTests = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.labTests =  responseModel.data;
      }
    }, error1 => {
      this.fetchingLatTests = false;
    });
   // console.log(id);
  }

  logTestAndCategory(test: any) {
    console.log(test.id);
    this.selectedCategory = test.categoryId;
    this.searchForm.get('labTestCategory').setValue(this.selectedCategory);
    this.labTestCategoriesService.getLabTestsFromLabCategories(this.selectedCategory).subscribe(data => {
      this.fetchingLatTests = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.labTests =  responseModel.data;
        this.selectedLabTest = test.id;
        this.searchForm.get('labTest').setValue(this.selectedLabTest);
      }
    }, error1 => {
      this.fetchingLatTests = false;
    });
  }


  assign() {

    this.validateAllFormFields(this.searchForm);

    if (this.searchForm.valid) {
      const value = {
        actualLabTestId: this.selectedLabTest,
        labTestTemplateId: this.code
      };
      this.labTestCategoriesService.assignToTemplate(value).subscribe(data => {
        console.log(data);
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
          this.showSuccess(responseModel.message);
        } else {
          this.showFailed(responseModel.message);
        }
      }, error1 => {
        if (error1.message) {
          this.showFailed(error1.message);
        } else {
          this.showFailed(error1.error.message);
        }
      });
    } else {
      this.showFailed('Kindly select a category and lab test');
    }
  }


  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }


  showSuccess(message: string) {
    this.toastService.success(message, 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }


  fetchAssignmentHistory(id) {
    this.labTestCategoriesService.fetchAssignmentHistoryByTemplateId(id).subscribe(data => {
      const responseModel: ResponseModel = data;
      console.log(data);
      if (responseModel.success) {
        this.histories = responseModel.data;
        // this.showSuccess(responseModel.message);
      } else {
        this.showFailed(responseModel.message);
      }
    }, error1 => {
      if (error1.message) {
        this.showFailed(error1.message);
      } else {
        this.showFailed(error1.error.message);
      }
    });
  }

  onSelectionChangeForLatTest($event: MatSelectChange) {
    console.log('' + $event.value);
    if ($event.value) {
      this.selectedLabTest = $event.value;
      // this.fetchAssignmentHistory($event.value);
    }
  }
}
