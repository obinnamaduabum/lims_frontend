import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {LabTestCategoriesService} from '../../../../service/lab-test-categories.service';
import {ResponseModel} from '../../../../models/response-model';

@Component({
  selector: 'app-create-lab-test',
  templateUrl: './create-lab-test.component.html',
  styleUrls: ['./create-lab-test.component.css']
})
export class CreateLabTestComponent implements OnInit {

  labTestCategoryFileToUpload: File = null;
  labTestCategoryFileToUploadErrors: any[] = [];
  constructor(private labTestCategoriesService: LabTestCategoriesService,
              private toastService: ToastrService) { }

  ngOnInit() {

  }

  handleFileInput(files: FileList) {
    this.labTestCategoryFileToUpload = files.item(0);
  }

  uploadFileLabCategory() {
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
  }


  showSuccess(message: string) {
    this.toastService.success(message , 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }
}
