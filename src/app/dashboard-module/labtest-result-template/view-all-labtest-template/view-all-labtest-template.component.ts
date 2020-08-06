import {Component, OnInit, Renderer2} from '@angular/core';
import * as JSONEditor from 'jsoneditor';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {$e} from 'codelyzer/angular/styles/chars';
import {LabTestTemplateService} from '../../../service/lab-test-template-service';
import {ResponseModel} from '../../../models/response-model';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-view-all-labtest-template',
  templateUrl: './view-all-labtest-template.component.html',
  styleUrls: ['./view-all-labtest-template.component.css']
})
export class ViewAllLabtestTemplateComponent implements OnInit {

  templates: TemplateDesign[] = [];
  pageNumber;
  pageSize;
  itemsLength;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  options: any;
  loading = true;

  constructor(private labTestTemplateService: LabTestTemplateService,
              private router: Router,
              private toastService: ToastrService) {
    this.options = {
      code : {
        mode: 'code',
      },
      tree : {
        mode: 'tree',
      }
    };
  }

  ngOnInit() {
    this.labTestTemplateService.index(0, 10).subscribe(data => {
      console.log(data);
      this.loading = false;
      const responseModel: ResponseModel =  data;
      if (responseModel.success) {
        this.templates = this.reformat(responseModel.data.dataList);
        this.pageSize = responseModel.data.pageSize;
        this.pageNumber = responseModel.data.pageNumber;
        this.itemsLength = responseModel.data.length;
      }
    }, error1 => {
      console.log(error1);
      this.loading = false;
    });
  }


  reformat(dataList){

    const list: any[] = [];
    for (const data of dataList) {

      const newData: any = {};

      newData.id = data.id;

      newData.position = data.position;

      newData.title = data.name;

      newData.code = data.code;

      newData.content = data.content;

      newData.labTest = data.labTest;

      newData.assigned = data.assigned;


      list.push(newData);

    }

    console.log(list);
    return list;
  }

  expansionOpened(id, isSetUp, index, data: any) {
     this.getId(id, isSetUp, index, data);
  }

  expansionClosed() {

  }
  //   this.jsonEditorTree = new JSONEditor(document.getElementById('jsonEditorTree'), this.options.tree);
  //   this.setDefaultOptions();
  // }

  getId(id: any, isSetUp: boolean, index: any, data: any) {
    if (!isSetUp) {
      const template = this.templates[index];
      template.isSetUp = true;
      this.templates[index] = template;
      const jsonEditorCode = new JSONEditor(document.getElementById(id), this.options.code);
      jsonEditorCode.set(JSON.parse(data));
    }
  }

  switchPage($event: PageEvent) {
    this.labTestTemplateService.index($event.pageIndex, $event.pageSize).subscribe(data => {
      this.loading = false;
      const responseModel: ResponseModel =  data;
      if (responseModel.success) {
        this.templates = responseModel.data.dataList;
        this.pageSize = responseModel.data.pageSize;
        this.pageNumber = responseModel.data.pageNumber;
        this.itemsLength = responseModel.data.length;
      }
    }, error1 => {
      this.loading = false;
    });
  }

  redirectTo(code: string, url: string) {
    this.router.navigate([url + '/' + code]);
  }

  removeAssignment(code: any, index: number) {
    this.labTestTemplateService.removeAssignment(code).subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {

        const template = this.templates[index];
        template.assigned = false;
        this.templates[index] = template;
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
  }



  showSuccess(message: string) {
    this.toastService.success(message, 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }
}

export interface TemplateDesign {
  title: string;
  isSetUp: boolean;
  content: string;
  position: any;
  code: any;
  assigned: boolean;
  labTest: any;
  labTestCategory: any;
}
