import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {LabTestCategoriesService} from '../../../../service/lab-test-categories.service';
import {ResponseModel} from '../../../../models/response-model';

@Component({
  selector: 'app-upload-lab-tests',
  templateUrl: './upload-lab-tests.component.html',
  styleUrls: ['./upload-lab-tests.component.css']
})
export class UploadLabTestsComponent implements OnInit {

  labTestCategoryFileToUpload: File = null;
  labTestFileToUpload: File = null;
  labTestCategoryFileToUploadErrors: any[] = [];
  labTestFileToUploadErrors: any[] = [];
  constructor(private labTestCategoriesService: LabTestCategoriesService,
              private toastService: ToastrService) { }

  ngOnInit() {

  }

  handleFileInput(files: FileList, type: string) {
    if (type === 'category') {
      this.labTestCategoryFileToUpload = files.item(0);
    } else if (type === 'test') {
      this.labTestFileToUpload = files.item(0);
    }
  }

  uploadFileLabCategory() {
    if (this.labTestCategoryFileToUpload) {
      this.labTestCategoriesService.uploadLabTestCategory(this.labTestCategoryFileToUpload).subscribe(data => {

        console.log(data);
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
          this.labTestCategoryFileToUploadErrors = responseModel.data;
          this.showSuccess(responseModel.message);
        } else {
          this.labTestCategoryFileToUploadErrors = responseModel.data;
          this.showFailed(responseModel.message);
        }
      }, error => {
        console.log(error);
      });
    } else {
      this.showFailed('File required');
    }
  }



  uploadFileLabTest() {
    if (this.labTestFileToUpload) {
      this.labTestCategoriesService.uploadLabTest(this.labTestFileToUpload).subscribe(data => {

        console.log(data);
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
          this.labTestFileToUploadErrors = responseModel.data;
          this.showSuccess(responseModel.message);
        } else {
          this.labTestFileToUploadErrors = responseModel.data;
          this.showFailed(responseModel.message);
        }
      }, error => {
        console.log(error);
      });
    } else {
      this.showFailed('File required');
    }
  }


  showSuccess(message: string) {
    this.toastService.success(message , 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }
}
