import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {JsonEditorComponent, JsonEditorOptions} from 'ang-jsoneditor';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {BeautifyJsonPipe} from '../../../pipe/beautify-json-pipe';
import {LabTestTemplateService} from '../../../service/lab-test-template-service';
import {ResponseModel} from '../../../models/response-model';

@Component({
  selector: 'app-edit-lab-test-template',
  templateUrl: './edit-lab-test-template.component.html',
  styleUrls: ['./edit-lab-test-template.component.css']
})
export class EditLabTestTemplateComponent implements OnInit {

  formGroup: FormGroup;
  @ViewChild(JsonEditorComponent, {static: true}) editor: JsonEditorComponent;
  matcher = new MyErrorStateMatcher();
  options = new JsonEditorOptions();
  text = '';
  private code: string;
  myJsonData: any;

  // options = {maxLines: 1000, printMargin: false};

  constructor(private fb: FormBuilder,
              private beautifyJsonPipe: BeautifyJsonPipe,
              private labTestTemplateService: LabTestTemplateService,
              private toastService: ToastrService,
              private activatedRoute: ActivatedRoute) {
    this.options.mode = 'code';
    this.options.modes = ['code', 'text', 'tree', 'view'];
    this.options.statusBar = false;
    // this.options.onError = () => {
    //   console.log('xxxxxxx');
    // };
    this.options.onChange = () => {
      try {
        const json = this.editor.get();
        if (json) {
          console.log(JSON.stringify(json));
          this.formGroup.get('data').setValue(JSON.stringify(json));
        }
      } catch (e) {
        this.formGroup.get('data').setValue(null);
        console.log('error!!!!');
      }
    };
  }

  ngOnInit() {
    this.doFormGroup();
    this.code = this.activatedRoute.snapshot.paramMap.get('code');

    console.log(this.code);

    this.labTestTemplateService.findByCode(this.code).subscribe(data => {

      console.log(data);
      const responseModel: ResponseModel = data;

      if (responseModel.success) {
        this.patch(responseModel.data, this.code);
      }
    }, error1 => {});
  }

  patch(data: any, fetchedCode: string) {
    this.formGroup.patchValue({
      title: data.title,
      data: data.data,
      code: fetchedCode
    });
    this.myJsonData = JSON.parse(data.data);
  }
  // beautifyJson() {
  //   console.log(this.formGroup.get('data').value);
  //   this.labTestTemplate = this.beautifyJsonPipe.transform(this.formGroup.get('data').value);
  //   console.log(this.labTestTemplate);
  //   // this.labTestTemplate
  // }

  doFormGroup() {
    this.formGroup = this.fb.group({
      data: ['', [Validators.required]],
      title: ['', [Validators.required]],
      code: ['', []]
    });
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

  save() {
    console.log(this.formGroup.getRawValue());
    this.validateAllFormFields(this.formGroup);
    if (this.formGroup.valid) {
      this.labTestTemplateService.update(this.formGroup.getRawValue()).subscribe(data => {
        const responseModel: ResponseModel = data;
        if (responseModel.status) {
          this.showSuccess(responseModel.message);
        } else {
          this.showFailed(responseModel.message);
        }
      }, error1 => {
        console.log(error1);
        this.showFailed(error1.message);
      });
    } else {
      this.showFailed('Kindly fill all required fields');
    }
  }

  showSuccess(message: string) {
    this.toastService.success(message, 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }

}
