import {Component, Inject, OnInit} from '@angular/core';
import {PortalUserModel} from '../../../models/portal-user-model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../../service/user.service';
import {ResponseModel} from '../../../models/response-model';


@Component({
  selector: 'app-sample-collected-by-dialog',
  templateUrl: './sample-collected-by-dialog.component.html',
  styleUrls: ['./sample-collected-by-dialog.component.css']
})
export class SampleCollectedByDialogComponent implements OnInit {

  portalUserModel: PortalUserModel;
  loading = true;
  constructor(public dialogRef: MatDialogRef<SampleCollectedByDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private userService: UserService) {
  }


  fetchPortalUserInfo() {

    this.userService.getPortalUserById(this.data.userId).subscribe(data => {
      this.loading = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.portalUserModel = responseModel.data;
      } else {

      }
    }, error1 => {
    });


  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    this.fetchPortalUserInfo();
  }

}


interface DialogData {
  userId: any;
}
