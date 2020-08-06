import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {JsonEditorComponent, JsonEditorOptions} from 'ang-jsoneditor';
import {ToastrService} from 'ngx-toastr';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {BeautifyJsonPipe} from '../../../pipe/beautify-json-pipe';
import {LabTestTemplateService} from '../../../service/lab-test-template-service';
import {ResponseModel} from '../../../models/response-model';

@Component({
  selector: 'app-create-labtest-template',
  templateUrl: './create-labtest-template.component.html',
  styleUrls: ['./create-labtest-template.component.css']
})
export class CreateLabtestTemplateComponent implements OnInit {

  formGroup: FormGroup;
  @ViewChild(JsonEditorComponent, {static: true}) editor: JsonEditorComponent;
  matcher = new MyErrorStateMatcher();
  options = new JsonEditorOptions();
  text = '';


  // options = {maxLines: 1000, printMargin: false};

  constructor(private fb: FormBuilder,
              private beautifyJsonPipe: BeautifyJsonPipe,
              private labTestTemplateService: LabTestTemplateService,
              private toastService: ToastrService) {
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
         // console.log(JSON.stringify(json));
          this.formGroup.get('data').setValue(JSON.stringify(json));
          this.formGroup.get('data').setErrors(null);
        }
      } catch (e) {
        this.formGroup.get('data').setValue(null);
        // console.log('error!!!!');
        this.formGroup.get('data').setErrors({jsonInvalid: true});
      }
    };
  }

  ngOnInit() {
    this.doFormGroup();
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
      title: ['', [Validators.required]]
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
    this.validateAllFormFields(this.formGroup);
    // console.log(this.formGroup.getRawValue());
    // console.log(this.formGroup.valid);
    if (this.formGroup.valid) {
      this.labTestTemplateService.create(this.formGroup.getRawValue()).subscribe(data => {
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
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
