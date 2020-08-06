import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ResponseModel} from '../../../models/response-model';
import {PaymentService} from '../../../service/payment.service';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.css']
})
export class ViewAllComponent implements OnInit {
  listOfPaymentMethods: any[] = [];
  constructor(private paymentService: PaymentService,
              private router: Router) { }

  ngOnInit() {
    this.paymentService.index().subscribe(data => {
      const responseModel: ResponseModel = data;
      console.log(responseModel.data);
      if (responseModel.success) {
        this.listOfPaymentMethods = responseModel.data;
      }
    }, error1 => {});
  }


  redirectToEdit(id: any) {
    this.router.navigate(['/dashboard/lab/settings/payment/edit', id]);
  }

}
