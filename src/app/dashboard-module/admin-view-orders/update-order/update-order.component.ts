import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {SampleCollectedByDialogComponent} from '../sample-collected-by-dialog/sample-collected-by-dialog.component';
import {LabTestOrdersService} from '../../../service/lab-test-orders-service';
import {MatDialog} from '@angular/material/dialog';
import {SampleTypeConstant} from '../../../lh-enum/sample-type-constant';
import {ReportService} from '../../../service/report.service';
import {PrintService} from '../../../service/print.service';
import {DataToPrintService} from '../../../service/data-to-print.service';
import {ResponseModel} from '../../../models/response-model';


@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css']
})
export class UpdateOrderComponent implements OnInit {

  orderInfo: any;
  items: any[] = [];
  portalUerModel: any;
  loading = true;
  id: any;
  SampleTypeConstant = SampleTypeConstant;
  printingStatus = false;

  constructor(private labTestOrdersService: LabTestOrdersService,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastrService,
              public dialog: MatDialog,
              private router: Router,
              private reportService: ReportService,
              private printService: PrintService,
              private dataToPrintService: DataToPrintService) {
  }

  ngOnInit() {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log('am me' + this.id);
    this.labTestOrdersService.findById(this.id).subscribe(data => {
      this.loading = false;
     // console.log('whore data');
     // console.log(data);
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.orderInfo = responseModel.data;

        this.dataToPrintService.setOrderInfo(this.orderInfo);
        this.portalUerModel = this.orderInfo.portalUserPojo;
        this.dataToPrintService.setPortalUerModel(this.portalUerModel);
        this.items = responseModel.data.labTestDetailsPojos;
        this.dataToPrintService.setItems(this.items);

       // console.log(this.items);
      } else {
        this.router.navigate(['/404']);
      }
    }, error1 => {
      this.loading = false;
    });
  }


  updateSampleCollectionStatus(uniqueId: string, testId: any) {
    const itemIndex = this.items.findIndex(element => element.uniqueId === uniqueId);

    const value = {
      uniqueId,
      labTestId: testId
    };
    this.labTestOrdersService.updateSampleCollectionStatus(value, this.id).subscribe(data => {
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        const item = this.items[itemIndex];
        item.sampleCollectionPojo = responseModel.data.sampleCollectionPojo;
        this.items[itemIndex] = item;
        this.showSuccess(responseModel.message);
      } else {
        this.showFailed(responseModel.message);
      }
    }, error1 => {
      this.showFailed(error1.error.message);
    });
  }

  showSuccess(message: string) {
    this.toastService.success(message, 'Success!');
  }

  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }


  openDialog(userId: any): void {
    if (userId) {
      const dialogRef = this.dialog.open(SampleCollectedByDialogComponent, {
        width: '250px',
        data: { userId}
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
        // this.animal = result;
      });
    } else {
      this.showFailed('Sample collected by not found');
    }
  }

  cashCollectedToggleChange() {
    this.updateCashCollectedStatus();
  }

  updateCashCollectedStatus() {
    this.labTestOrdersService.updateCashCollectionStatus(this.id).subscribe(data => {
      // console.log(data);
      this.loading = false;
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.orderInfo.cashCollected = true;
        this.showSuccess(responseModel.message);
      } else {
        this.showFailed(responseModel.message);
      }
    }, error1 => {
      this.showFailed(error1.error.message);
    });

  }


  downloadReceipt() {
    this.reportService.downloadPatientReceiptPDFForAdmin(this.id, 'PDF');
  }

  printInvoice() {
    const invoiceIds = [this.id];
    this.printService.printDocument('invoice', invoiceIds, '/dashboard/lab/orders/' + this.id);
  }
}

interface DialogData {
  userId: any;
}

