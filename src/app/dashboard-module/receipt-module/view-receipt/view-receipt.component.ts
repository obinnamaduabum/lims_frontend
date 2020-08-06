import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PrintService} from '../../../service/print.service';
import {DataToPrintService} from '../../../service/data-to-print.service';
import {AuthenticationService} from '../../../service/authentication-service';
import {ResponseModel} from '../../../models/response-model';
import {PortalUserModel} from '../../../models/portal-user-model';
import {PortalAccountTypeConstant} from '../../../lh-enum/portal-account-type';
import {ReportService} from '../../../service/report.service';
import {LabTestOrdersService} from '../../../service/lab-test-orders-service';

@Component({
  selector: 'app-view-receipt',
  templateUrl: './view-receipt.component.html',
  styleUrls: ['./view-receipt.component.css']
})
export class ViewReceiptComponent implements OnInit {

  orderInfo: any;
  portalUerModel: any;
  items: any[] = [];
  id: any;
  printingStatus = false;
  deviceInfo: any;
  isPatient = false;

  constructor(private labTestOrdersService: LabTestOrdersService,
              private activatedRoute: ActivatedRoute,
              private reportService: ReportService,
              private printService: PrintService,
              private dataToPrintService: DataToPrintService,
              // private deviceService: DeviceDetectorService,
              private toastService: ToastrService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log(this.id);
    this.labTestOrdersService.findById(this.id).subscribe(data => {
      // console.log(data);
      const responseModel: ResponseModel = data;
      if (responseModel.success) {
        this.orderInfo = responseModel.data;
        this.dataToPrintService.setOrderInfo(this.orderInfo);
        this.portalUerModel = this.orderInfo.portalUserPojo;
        this.dataToPrintService.setPortalUerModel(this.portalUerModel);
        this.items = responseModel.data.labTestDetailsPojos;
        this.dataToPrintService.setItems(this.items);
      }
    }, error1 => {
    });

    this.printService.printingStatus.subscribe(data => {
      this.printingStatus = data;
    });


    this.authenticationService.getUserInfo().subscribe(data => {
      // console.log(data);
      const responseModel: ResponseModel = data;
      if (responseModel) {
        const portalUser: PortalUserModel = responseModel.data;
        console.log(portalUser);
        portalUser.portalAccountDescriptionDtoList.filter(value => {
          if (value.portalAccountTypeConstant === PortalAccountTypeConstant.LAB.toString()) {
            this.isPatient = false;
          } else if (value.portalAccountTypeConstant === PortalAccountTypeConstant.PATIENT.toString()) {
            this.isPatient = true;
          }
        });
      }
    }, error1 => {
    });
  }

  downloadReceipt() {
    if (this.isPatient) {
      this.reportService.downloadPatientReceiptPDF(this.id, 'PDF');
    } else {
      this.reportService.downloadPatientReceiptPDFForAdmin(this.id, 'PDF');
    }
  }

  printInvoice() {

    // this.deviceInfo = this.deviceService.getDeviceInfo();
    // const isMobile = this.deviceService.isMobile();
    // const isTablet = this.deviceService.isTablet();
    // const isDesktopDevice = this.deviceService.isDesktop();
    // console.log(this.deviceInfo);
    // console.log(isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    // console.log(isTablet);  // returns if the device us a tablet (iPad etc)
    // console.log(isDesktopDevice); // returns if the app is running on a Desktop browser.

    //  if (isDesktopDevice) {
    const invoiceIds = [this.id];
    // this.printService.printDocument('invoice', invoiceIds, '/dashboard/patient/receipt/' + this.id);

    this.alternatePrint();
    // } else {
    //   this.showFailed('Sorry, but print is not supported on mobile/tablet, kindly use the download button');
    // }
  }


  showFailed(message: string) {
    this.toastService.error(message, 'Error!');
  }


  showSuccessful(message: string) {
    this.toastService.success(message, 'Success!');
  }


  alternatePrint() {
    let popupWinindow;
    const innerContents = document.getElementById('print-section').innerHTML;
    popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    popupWinindow.document.write('' +
      '<html>' +
      '<head>' +
      '<style>' +
      'table {\n' +
      '  border: 1px solid #ccc;\n' +
      '  border-collapse: collapse;\n' +
      '  margin: 0;\n' +
      '  padding: 0;\n' +
      '  width: 100%;\n' +
      '  table-layout: fixed;\n' +
      '}\n' +
      '\n' +
      'table caption {\n' +
      '  font-size: 1.5em;\n' +
      '  margin: .5em 0 .75em;\n' +
      '}\n' +
      '\n' +
      'table tr {\n' +
      '  background-color: #ffffff;\n' +
      '  border: 1px solid #ddd;\n' +
      '  padding: .35em;\n' +
      '}\n' +
      '\n' +
      'table th,\n' +
      'table td {\n' +
      '  padding: .625em;\n' +
      '  text-align: center;\n' +
      '}\n' +
      '\n' +
      'table th {\n' +
      '  font-size: .85em;\n' +
      '  letter-spacing: .1em;\n' +
      '  text-transform: uppercase;\n' +
      '}\n' +
      '\n' +
      '@media screen and (max-width: 600px) {\n' +
      '  table {\n' +
      '    border: 0;\n' +
      '  }\n' +
      '\n' +
      '  table caption {\n' +
      '    font-size: 1.3em;\n' +
      '  }\n' +
      '\n' +
      '  table thead {\n' +
      '    border: none;\n' +
      '    clip: rect(0 0 0 0);\n' +
      '    height: 1px;\n' +
      '    margin: -1px;\n' +
      '    overflow: hidden;\n' +
      '    padding: 0;\n' +
      '    position: absolute;\n' +
      '    width: 1px;\n' +
      '  }\n' +
      '\n' +
      '  table tr {\n' +
      '    border-bottom: 3px solid #ddd;\n' +
      '    display: block;\n' +
      '    margin-bottom: .625em;\n' +
      '  }\n' +
      '\n' +
      '  table td {\n' +
      '    border-bottom: 1px solid #ddd;\n' +
      '    display: block;\n' +
      '    font-size: .8em;\n' +
      '    text-align: right;\n' +
      '  }\n' +
      '\n' +
      '  table td::before {\n' +
      '    /*\n' +
      '    * aria-label has no advantage, it won\'t be read inside a table\n' +
      '    content: attr(aria-label);\n' +
      '    */\n' +
      '    content: attr(data-label);\n' +
      '    float: left;\n' +
      '    font-weight: bold;\n' +
      '    text-transform: uppercase;\n' +
      '  }\n' +
      '\n' +
      '  table td:last-child {\n' +
      '    border-bottom: 0;\n' +
      '  }\n' +
      '}\n' +
      '\n' +
      '\n' +
      '.view-btn {\n' +
      '  color: #fff;\n' +
      '  font-size: 14px;\n' +
      '  background-color: #007bff;\n' +
      '  border-color: transparent;\n' +
      '}\n' +
      '\n' +
      '.view-btn:active, .view-btn:hover {\n' +
      '  font-size: 14px;\n' +
      '  color: #fff;\n' +
      '  background-color: #007bff;\n' +
      '  border-color: transparent;\n' +
      '}\n' +
      '\n' +
      '\n' +
      '.download-btn {\n' +
      '  color: #fff;\n' +
      '  font-size: 14px;\n' +
      '  background-color: #4dcc2b;\n' +
      '  border-color: transparent;\n' +
      '}\n' +
      '\n' +
      '.download-btn:active, .download-btn:hover {\n' +
      '  font-size: 14px;\n' +
      '  color: #fff;\n' +
      '  background-color: #4dcc2b;\n' +
      '  border-color: transparent;\n' +
      '}\n' +
      '\n' +
      '.custom-padding {\n' +
      '  padding-top: 20px;\n' +
      '  padding-bottom: 40px;\n' +
      '}\n' +
      '\n' +
      '\n' +
      '/*quantity*/\n' +
      '\n' +
      '.quantity {\n' +
      '  display: inline-block; }\n' +
      '\n' +
      '.quantity .input-text.qty {\n' +
      '  width: 35px;\n' +
      '  height: 39px;\n' +
      '  padding: 0 5px;\n' +
      '  text-align: center;\n' +
      '  background-color: transparent;\n' +
      '  border: 1px solid #efefef;\n' +
      '}\n' +
      '\n' +
      '.quantity.buttons_added {\n' +
      '  text-align: left;\n' +
      '  position: relative;\n' +
      '  white-space: nowrap;\n' +
      '  vertical-align: top; }\n' +
      '\n' +
      '.quantity.buttons_added input {\n' +
      '  display: inline-block;\n' +
      '  margin: 0;\n' +
      '  vertical-align: top;\n' +
      '  box-shadow: none;\n' +
      '}\n' +
      '\n' +
      '.quantity.buttons_added .minus,\n' +
      '.quantity.buttons_added .plus {\n' +
      '  padding: 7px 10px 8px;\n' +
      '  height: 41px;\n' +
      '  background-color: #ffffff;\n' +
      '  border: 1px solid #efefef;\n' +
      '  cursor:pointer;}\n' +
      '\n' +
      '.quantity.buttons_added .minus {\n' +
      '  border-right: 0; }\n' +
      '\n' +
      '.quantity.buttons_added .plus {\n' +
      '  border-left: 0; }\n' +
      '\n' +
      '.quantity.buttons_added .minus:hover,\n' +
      '.quantity.buttons_added .plus:hover {\n' +
      '  background: #eeeeee; }\n' +
      '\n' +
      '.quantity input::-webkit-outer-spin-button,\n' +
      '.quantity input::-webkit-inner-spin-button {\n' +
      '  -webkit-appearance: none;\n' +
      '  -moz-appearance: none;\n' +
      '  margin: 0; }\n' +
      '\n' +
      '.quantity.buttons_added .minus:focus,\n' +
      '.quantity.buttons_added .plus:focus {\n' +
      '  outline: none; }\n' +
      '\n' +
      '.grand-total {\n' +
      '  text-align: right;\n' +
      '  padding: 20px;\n' +
      '  font-size: 24px\n' +
      '}\n' +
      '\n' +
      '\n' +
      '\n' +
      '.check-out-btn {\n' +
      '  color: #fff;\n' +
      '  font-size: 15px;\n' +
      '  background-color: #47b329;\n' +
      '  border-color: #4dcc2b;\n' +
      '}\n' +
      '\n' +
      '.check-out-btn:active, .check-out-btn:hover {\n' +
      '  font-size: 15px;\n' +
      '  color: #fff;\n' +
      '  background-color: #36971e;\n' +
      '  border-color: #36971e;\n' +
      '}\n' +
      '\n' +
      '\n' +
      '.mat-form-field {\n' +
      '  display: inline;\n' +
      '}\n' +
      '</style>' +
      '</head>' +
      '<body onload="window.print()">' + innerContents
      + '</html>');
    popupWinindow.document.close();
    popupWinindow.onfocus = () => {
      setTimeout(() => {
        popupWinindow.top.close();
        }, 500);
    };
  }
}
