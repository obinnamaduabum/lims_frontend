import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {MatDialog} from '@angular/material/dialog';
import {BeautifyJsonPipe} from '../../../pipe/beautify-json-pipe';
import {LabTestTemplateService} from '../../../service/lab-test-template-service';
import * as JSONEditor from 'jsoneditor';
import {ResponseModel} from '../../../models/response-model';

@Component({
  selector: 'app-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.css']
})
export class JsonEditorComponent implements OnInit {

  formGroup: FormGroup;
  @ViewChild(JsonEditorComponent, {static: true}) editor: JsonEditorComponent;
  labTestTemplate: any = '';
  // @ViewChild('editor', { static: true}) editor;
  matcher = new MyErrorStateMatcher();
  // options = new JsonEditorOptions();
  text = '';
  dialog: MatDialog;
  renderer: Renderer2;
  options: any;
  jsonEditorCode: any;
  jsonEditorTree: any;
  darkMode: boolean;
  autoConvert: boolean;
  jsonCode: any;

  constructor(dialog: MatDialog, renderer: Renderer2,
              private fb: FormBuilder,
              private beautifyJsonPipe: BeautifyJsonPipe,
              private labTestTemplateService: LabTestTemplateService,
              private toastService: ToastrService) {
    this.dialog = dialog;
    this.renderer = renderer;
    // this.options.mode = 'code';
    // this.options.modes = ['code', 'text', 'tree', 'view'];
    // this.options.schema = schema;
    // this.options.statusBar = false;
    // this.options.onChange = () => {
    //   console.log(this.editor.get());
    // };
  }

  ngOnInit() {

    this.doFormGroup();

    this.options = {
      code : {
        mode: 'code',
        onChange: () => {
          const json = this.jsonEditorCode.get();
          if (json) {
            this.jsonCode = json;
            this.setLocalStorage('jsonCode', JSON.stringify(json));
            if (this.autoConvert) {
              this.validateJSON('Tree');
            }
          }
        }
      },
      tree : {
        mode: 'tree',
        onChange: () => {
          const json = this.jsonEditorTree.get();
          if (json) {
            this.jsonCode = json;
            this.setLocalStorage('jsonCode', JSON.stringify(json));
            this.validateJSON('Code');
          }
        }
      }
    };
    this.jsonEditorCode = new JSONEditor(document.getElementById('jsonEditorCode'), this.options.code);
    this.jsonEditorTree = new JSONEditor(document.getElementById('jsonEditorTree'), this.options.tree);
    this.setDefaultOptions();
  }

  validateJSON = (type) => {
    if (type === 'Tree') {
      this.jsonEditorTree.set(this.jsonCode);
    } else if (type === 'Code') {
      this.jsonEditorCode.set(this.jsonCode);
    }
  }

  toggleTheme = (darkMode: boolean) => {
    this.setLocalStorage('darkModeJSON', darkMode);
    darkMode ? this.renderer.addClass(document.body, 'dark-theme') : this.renderer.removeClass(document.body, 'dark-theme');
  }

  setLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
  }

  clearStorageOptions = () => {
    const className = this.darkMode ? 'confirmation-dark' : 'confirmation';
    // const dialogRef = this.dialog.open(ConfirmResetComponent, {
    //   panelClass: className,
    //   restoreFocus: false
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     localStorage.removeItem('darkModeJSON');
    //     localStorage.removeItem('jsonCode');
    //     localStorage.removeItem('autoConvertJSON');
    //     this.setDefaultOptions();
    //   }
    // });
  }

  setDefaultOptions = () => {
    this.darkMode = JSON.parse(localStorage.getItem('darkModeJSON'));
    this.autoConvert = JSON.parse(localStorage.getItem('autoConvertJSON'));
    this.jsonCode = localStorage.getItem('jsonCode') ? JSON.parse(localStorage.getItem('jsonCode')) : {
      Array: [1, 2, 3],
      Boolean: true,
      Null: null,
      Number: 123,
      Object: {
        a: 'b',
        c: 'd'
      },
      String: 'Hello World'
    };
    this.validateJSON('Code');
    if (this.autoConvert) {
      this.validateJSON('Tree');
    }
    if (this.darkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    }
  }

  // options = {maxLines: 1000, printMargin: false};


  onChange(code) {
    console.log('new code', code);
  }

  beautifyJson() {
    console.log(this.formGroup.get('data').value);
    this.labTestTemplate = this.beautifyJsonPipe.transform(this.formGroup.get('data').value);
    console.log(this.labTestTemplate);
    // this.labTestTemplate
  }

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
    if (this.formGroup.valid) {

      this.labTestTemplateService.create(this.formGroup.getRawValue()).subscribe(data => {
        const responseModel: ResponseModel = data;
        if (responseModel.status) {
          this.showSuccess(responseModel.message);
        } else {
          this.showFailed(responseModel.message);
        }
      }, error1 => {
        this.showFailed(error1.error.message);
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
