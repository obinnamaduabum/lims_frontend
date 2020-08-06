import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MyErrorStateMatcher} from '../../../models/my-error-state-matcher';
import {LabTestOrdersService} from '../../../service/lab-test-orders-service';
import {LabTestTemplateService} from '../../../service/lab-test-template-service';
import {CustomRangeValidatorMin} from '../../../validator/custom-range-min.validator';
import {CustomRangeValidatorMax} from '../../../validator/custom-range-max.validator';
import {CustomInputType} from '../../../validator/custom-validate-input-type.validator';
import {ResponseModel} from '../../../models/response-model';

@Component({
  selector: 'app-patient-result',
  templateUrl: './patient-result.component.html',
  styleUrls: ['./patient-result.component.css']
})
export class PatientResultComponent implements OnInit {
  formDataJson = [];
  dynamicForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  code: string;
  sampleId: string;
  medicalLabScientistSampleCollectedId: any;
  loading = true;


  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private labTestTemplateService: LabTestTemplateService,
              private labTestOrdersService: LabTestOrdersService,
              private toastrService: ToastrService) {}

  ngOnInit() {


    this.code = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params.sampleId);
      this.sampleId = params.sampleId;
      this.medicalLabScientistSampleCollectedId = params.medicalLabScientistId;
    });

    if (this.code) {
      this.labTestTemplateService.findByLabTestCode(this.code).subscribe(data => {
        const responseModel: ResponseModel = data;

        console.log(responseModel);

        this.loading = false;
        if (responseModel.success) {
          // console.log(responseModel.data);
          const formDataJson = JSON.parse(responseModel.data.data);
          // console.log(formDataJson);
          this.formDataJson = formDataJson;
          this.dynamicForm = this.createControl(formDataJson);
        } else {
          this.showError(responseModel.message);
        }
      }, error1 => {
        this.loading = false;
        this.showError('Internal server error');
      });
    }
    // console.log(code);


    // console.log(JSON.stringify(this.formDataJson));
  }


  showError(message) {
    this.toastrService.error(message);
  }

  createControl(formDataJson: any) {
    const group = this.fb.group({});
    formDataJson.forEach(field => {
      if (field.type === 'button') {
        return;
      }
      const control = this.fb.control(
        field.value,
        this.bindValidations(field.validations || [], field)
      );
      group.addControl(field.label, control);
    });
    return group;
  }

  bindValidations(validations: any[], field: any) {
    if (validations.length > 0) {
      const validators = [];
      validations.forEach(validation => {
        switch (validation.name) {
          case 'required':
            validators.push(Validators.required);
            break;
          case 'minLength':
            validators.push(CustomRangeValidatorMin(field.label, field.min));
            break;
          case 'maxLength':
            validators.push(CustomRangeValidatorMax(field.label, field.max));
            break;
          case 'pattern':
            validators.push(Validators.pattern(validation.Expression));
            break;
          case 'inputType':
            validators.push(CustomInputType(field.inputType));
            break;
        }
      });
      return validators;
    }
    return null;
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

  onSubmit($event: Event) {
    this.validateAllFormFields(this.dynamicForm);
    if (this.dynamicForm.valid) {
      const patientResult = new PatientResultModel();
      patientResult.data = this.dynamicForm.getRawValue();
      patientResult.restTemplateId = this.code;
      patientResult.patientSampleId = this.sampleId;
      patientResult.medicalLabScientistSampleCollectedId = this.medicalLabScientistSampleCollectedId;
      console.log(patientResult);


      this.labTestOrdersService.createPatientResult(patientResult).subscribe(data => {
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
          this.showSuccess(responseModel.message);
          console.log(responseModel.data);
        } else {
          this.showFailed(responseModel.message);
          console.log(responseModel.data);
        }

      }, error1 => {
        console.log(error1);
      });
    } else {

      this.scrollToTop();
      this.showFailed('Kindly fill all required fields');
    }
  }



  showFailed(message: string) {
    this.toastrService.error(message, 'Error!');
  }


  showSuccess(message: string) {
    this.toastrService.success(message, 'Success!');
  }

  scrollToTop() {
    window.scrollTo(0, 0);
    window.onbeforeunload = () => {
      window.scrollTo(0, 0);
    };
  }
}


export class PatientResultModel {
  data: any;
  restTemplateId: string;
  patientSampleId: string;
  medicalLabScientistSampleCollectedId: any;
}
