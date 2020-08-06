import {AfterViewInit, Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FormBuilder, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseModel } from 'src/app/models/response-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { TestsSearchModel } from 'src/app/models/tests-search.model';
import { AdminSettingsModel } from 'src/app/models/admin-settings-model';
import { LabTestCategoriesService } from 'src/app/service/lab-test-categories.service';
import { GraphqlService } from 'src/app/service/graphql-service';
import { AdminSettingsService } from 'src/app/service/admin-settings-service';
import { MyCookieService } from 'src/app/service/mycookieservice.service';
import {TestModel} from '../../models/test-model';
import {SlideInOutAnimation} from '../../animations/slidein-out-animation';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-tests-page',
  templateUrl: './tests-page.component.html',
  styleUrls: ['./tests-page.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]), SlideInOutAnimation
  ]
})
export class TestsPageComponent implements OnInit, AfterViewInit {

  testCategories: any[] = [];
  filteredTestCategories: any[] = [];
  allTests: any[] = [];
  showAdvanced = false;
  loading = true;
  public lottieConfig: object;
  anim: any;
  adminSettingsModel: AdminSettingsModel;
  mode: string;
  searchForm: FormGroup;
  length;
  pageSize = 8;
  pageNumber = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  addedToCart: string;
  animationState = 'out';

  constructor(private labTestCategoriesService: LabTestCategoriesService,
              private snackBar: MatSnackBar,
              private myCookieService: MyCookieService,
              private fb: FormBuilder,
              private adminSettingsService: AdminSettingsService,
              private graphqlService: GraphqlService) {
  }

  ngOnInit() {
    this.lottieConfig = {
      path: 'assets/lottie/loading-spinner.json',
      autoplay: true,
      loop: true
    };

    this.searchForm = this.fb.group({
      categoryName: ['', []],
      testName: ['', []]
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
          this.setPageInfo(paginationModel);
        } else {
          this.filteredTestCategories = [];
        }
      });
    });
  }

  toggleCategoryShow() {
    this.showAdvanced = !this.showAdvanced;
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 1000,
      panelClass: ['green-snackbar']
    });
  }

  AddItemToCart(test: any) {
    const newTest: TestModel = test;
    newTest.randomCode = Math.random().toString(36).replace('0.', '');
    newTest.currencyCode = this.adminSettingsModel.currencyType;
    this.myCookieService.setShoppingCartData(newTest);
    let message = '';
    if (this.addedToCart) {
      message =  this.addedToCart;
    } else {
      message = 'Added to cart';
    }
    this.openSnackBar(message, '');
  }

  fetchCategories() {
    this.loading = true;
    this.graphqlService.getLabTestCategoriesAndPagination().subscribe(data => {
      const result: any = data;
      if (result) {
        this.loading = false;
        const paginationModel = result.data.pagination;
        this.allTests = paginationModel.dataList;
        this.testCategories = result.data.labTestCategories;
        this.adminSettingsModel = result.data.adminSettings;
        this.setPageInfo(paginationModel);
      }
    }, error1 => {});
  }

  searchLabCategoriesAndTests() {
    this.loading = true;
    const testSearchModel: TestsSearchModel = new TestsSearchModel();
    if (this.searchForm.get('testName').value) {
      testSearchModel.searchValue = this.searchForm.get('testName').value;
    }

    if (this.searchForm.get('categoryName').value) {
      testSearchModel.categoryName = this.searchForm.get('categoryName').value;
    }

    // console.log(this.searchForm.get('testName').value);
    this.labTestCategoriesService.searchLabCategoriesAndTests(testSearchModel, 0, 8).subscribe(data => {
      const responseModel: ResponseModel = data;
      this.loading = false;
      console.log(responseModel);
      if (responseModel.success) {
        const paginationModel: PaginationModel = responseModel.data;
        this.allTests = paginationModel.dataList;
        this.setPageInfo(paginationModel);
      }
    }, error1 => {
    });
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  ngAfterViewInit(): void {
   // this.searchLabCategoriesAndTests();
  }


  setPageInfo(paginationModel: PaginationModel) {
    this.smoothScrollToTop();
    this.pageSize = paginationModel.pageSize;
    this.pageNumber = paginationModel.pageNumber;
    this.length = paginationModel.length;
  }

  switchPage(event: PageEvent) {

    this.loading = true;
    const testSearchModel: TestsSearchModel = new TestsSearchModel();
    if (this.searchForm.get('testName').value) {
      testSearchModel.searchValue = this.searchForm.get('testName').value;
    }

    if (this.searchForm.get('categoryName').value) {
      testSearchModel.categoryName = this.searchForm.get('categoryName').value;
    }
    this.labTestCategoriesService.searchLabCategoriesAndTests(testSearchModel, event.pageIndex, event.pageSize).subscribe(data => {
      const responseModel: ResponseModel = data;
      this.loading = false;
      // console.log(responseModel.data);
      if (responseModel.success) {
        const paginationModel: PaginationModel = responseModel.data;
        this.allTests = paginationModel.dataList;
        this.setPageInfo(paginationModel);
      }
    }, error1 => {
    });
  }


  smoothScrollToTop() {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

}
