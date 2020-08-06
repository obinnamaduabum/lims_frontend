import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataToPrintService {
  orderInfo: BehaviorSubject<any> = new BehaviorSubject(undefined);
  portalUerModel: BehaviorSubject<any> = new BehaviorSubject(undefined);
  items: BehaviorSubject<any[]> = new BehaviorSubject([]);
  constructor() { }


  getOrderInfo() {
    return this.orderInfo;
  }

  setOrderInfo(value: any) {
    this.orderInfo.next(value);
  }

  getPortalUerModel() {
    return this.portalUerModel;
  }

  setPortalUerModel(value: any) {
    this.portalUerModel.next(value);
  }

  getItems() {
    return this.items;
  }

  setItems(value: any[]) {
    this.items.next(value);
  }
}
