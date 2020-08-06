import {Component, Inject, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EmailDialog} from '../../models/email-dialog-model';

@Component({
  selector: 'app-registration-successful',
  templateUrl: './registration-successful.component.html',
  styleUrls: ['./registration-successful.component.css']
})
export class RegistrationSuccessfulComponent implements OnInit {

  public lottieConfig: object;
  private anim: any;
  private animationSpeed = 1;
  constructor(
    public dialogRef: MatDialogRef<RegistrationSuccessfulComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmailDialog,
    private router: Router) {
    this.lottieConfig = {
      path: 'assets/lottie/1175-email.json',
      autoplay: true,
      loop: false
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  pause() {
    this.anim.pause();
  }

  setSpeed(speed: number) {
    this.animationSpeed = speed;
    this.anim.setSpeed(speed);
  }

  redirect(s: string) {
    this.onNoClick();
    this.router.navigate([s]);
  }
}
