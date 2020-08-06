import {AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {MatStepper} from '@angular/material/stepper';
import {MyErrorStateMatcher} from '../../models/my-error-state-matcher';
import {UserService} from '../../service/user.service';
import {PhoneNumberVerificationService} from '../../service/phone-number-verification';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ResponseModel} from '../../models/response-model';
import {SendVerificationCodeModel} from '../../models/send-verification-model';
import {CountdownComponent} from 'ngx-countdown';

@Component({
  selector: 'app-registration-successful-with-steps',
  templateUrl: './registration-successful-with-steps.component.html',
  styleUrls: ['./registration-successful-with-steps.component.css']
})
export class RegistrationSuccessfulWithStepsComponent implements OnInit, AfterViewInit {

  isLinear =  true;
  verificationCodeFormGroup: FormGroup;
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  matcher = new MyErrorStateMatcher();
  sendingVerificationCode = false;
  private key: string;
  lottieConfig: object;
  lottieConfigTwo: object;
  anim: any;
  animTwo: any;
  animationSpeed = 1;
  isStep2Valid = false;
  wereUsingEmail = false;
  sendingEmailVerificationCode = false;
  stepOne = false;
  stepOneHeader = false;
  stepTwo = false;
  stepTwoHeader = false;
  formattedPhoneNumber: any;
  timeOutExpired =  false;
  @ViewChild('counter', {static: false}) counter: CountdownComponent;
  config = {leftTime: 1800};
  phoneNumberUsed = false;
  emailUsed =  false;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
    console.log(this.key);
    if (event.key === 'Delete') {
      console.log('deleted');
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownEscHandler(event: KeyboardEvent) {
    console.log('escape');
  }


  @HostListener('document:keydown.delete', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log('delete');
  }
  constructor(private fb: FormBuilder,
              private toastService: ToastrService,
              private phoneNumberVerification: PhoneNumberVerificationService,
              private router: Router,
              private userService: UserService,
              private renderer: Renderer2,
              public dialogRef: MatDialogRef<RegistrationSuccessfulWithStepsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: SendVerificationCodeModel) {

    this.lottieConfig = {
          path: 'assets/lottie/1175-email.json',
          autoplay: false,
          loop: false
        };

    this.lottieConfigTwo = {
      path: 'assets/lottie/verify.json',
      autoplay: false,
      loop: false
    };
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  ngOnInit() {
    this.verificationCodeFormGroup = this.fb.group({
      code: ['', [Validators.required]]
    });
  }

  selectionChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 2) {
      console.log(event);
      if (this.emailUsed) {
        this.play();
      }
      if (this.phoneNumberUsed) {
        this.playTwo();
      }
    }

    if (event.selectedIndex === 1) {
      this.reStartTimer();
    }
    if (event.selectedIndex === 0) {
      this.stopTimer();
    }
  }

  next() {
    this.stepper.next();
  }
  gotoLastStep() {
    this.stepper.selectedIndex = 2;
  }
  sendVerificationCode() {
    this.setStepOne();
    this.emailUsed = false;
    this.phoneNumberUsed =  true;
    this.sendingVerificationCode = true;
    this.phoneNumberVerification.sendPhoneNumberVerificationCode(this.data.phoneNumber).subscribe(data => {
      const responseModel: ResponseModel = data;
      this.sendingVerificationCode = false;
      if (responseModel.success) {
        console.log(responseModel);
        this.next();
      } else {
        this.showFailed(responseModel.message);
      }
    }, error1 => {});
  }


  sendPhoneNumberVerificationCode() {
    this.sendingVerificationCode = true;
    this.phoneNumberVerification.sendPhoneNumberVerificationCode(this.data.phoneNumber).subscribe(data => {
      const responseModel: ResponseModel = data;
      this.sendingVerificationCode = false;
      if (responseModel.success) {
        console.log(responseModel);
        this.showSuccessful(responseModel.message);
      }
    }, error1 => {});
  }

  verifyPhoneNumberVerificationCode() {
    this.validateAllFormFields(this.verificationCodeFormGroup);
    if (this.verificationCodeFormGroup.valid) {
      this.phoneNumberVerification.verifyCode(this.verificationCodeFormGroup.get('code').value).subscribe(data => {
        const responseModel: ResponseModel = data;
        if (responseModel.success) {
         // this.isStep2Valid = true;
         //  this.next();
          this.setStepTwo();
          setTimeout(() => {
            this.next();
          }, 10);
        } else {
          this.showFailed(responseModel.message);
        }
      }, error1 => {
        this.showFailed(error1.error.message);
      });
    } else {
     // this.verificationCodeFormGroup.get('one').setErrors({invalid: true});
    }
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }


  showSuccessful(message: string) {
    this.toastService.success(message, 'Success!');
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

  keyTab(event, data) {
    let element;
    if (data) {
      element = event.srcElement.nextElementSibling; // get the sibling element
    } else {
      element = event.srcElement.previousElementSibling; // get the sibling element
    }

    if (element == null) { // check if its null
      return;
    } else {
      element.focus();   // focus if not null

      // this.renderer2.parentNode(this.el.nativeElement).focus();
    }
  }
  setStepOne() {
    this.stepOne = true;
    this.stepOneHeader = true;
  }

  setStepTwo() {
    this.stepTwo = true;
    this.stepTwoHeader = true;
  }

  sendVerificationEmail() {
    this.emailUsed = true;
    this.phoneNumberUsed = false;
    this.sendingEmailVerificationCode = true;
    this.wereUsingEmail = true;
    this.userService.resendVerificationEmail(this.data.email).subscribe(data => {
      const responseModel: ResponseModel = data;
      this.sendingEmailVerificationCode = false;
      console.log(responseModel);
      if (responseModel.success) {
        this.setStepOne();
        this.setStepTwo();

        setTimeout(() => {
         this.gotoLastStep();
        }, 10);
        // this.showFailed(responseModel.message);
      } else {
        this.showFailed(responseModel.message);
      }
    }, error1 => {});
  }

  goBack() {
    this.stepper.previous();
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }


  handleAnimationTwo(anim: any) {
    this.animTwo = anim;
  }

  redirect(s: string) {
    this.router.navigateByUrl(s);
  }
  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  playTwo() {
    this.animTwo.play();
  }

  pause() {
    this.anim.pause();
  }

  ngAfterViewInit(): void {

    // setTimeout(() => {
    //   this.oneElement.nativeElement.focus();
    // }, 50);
    // this.renderer.selectRootElement(this.oneElement.nativeElement).focus();
  }

  closeDialogueAndRedirect(value: string) {
    this.onNoClick();
    this.redirect(value);
  }


  onFinished() {
    this.timeOutExpired = true;
  }

  reStartTimer() {
    this.counter.restart();
  }

  onNotify($event: {}) {

  }

  onStart() {

  }

  stopTimer() {
    this.counter.stop();
  }
}
