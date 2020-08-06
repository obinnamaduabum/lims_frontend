import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataToPrintService} from '../../service/data-to-print.service';
import {PrintService} from '../../service/print.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  invoiceIds: string[];
  invoiceDetails: Promise<any>[];
  orderInfo: any;
  portalUerModel: any;
  items: any[] = [];

  constructor(route: ActivatedRoute,
              private printService: PrintService,
              private dataToPrintService: DataToPrintService) {
    this.invoiceIds = route.snapshot.params.invoiceIds
      .split(',');
  }

  ngOnInit() {
    this.dataToPrintService.getItems().subscribe(data => {
      this.items = data;
    });
    this.dataToPrintService.getPortalUerModel().subscribe(data => {
      this.portalUerModel = data;
    });
    this.dataToPrintService.getOrderInfo().subscribe(data => {
      this.orderInfo = data;
    });
    // console.log('ids: ' + this.invoiceIds);
    this.invoiceDetails = this.invoiceIds.map(id => this.getInvoiceDetails(id));
    Promise.all(this.invoiceDetails).then(() => this.printService.onDataReady());
  }

  getInvoiceDetails(invoiceId) {
    const amount = Math.floor((Math.random() * 100));
    return new Promise(resolve =>
      setTimeout(() => resolve({amount}), 1000)
    );
  }
}
