import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting = false;
  public printingStatus = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,
              private location: Location) { }

  printDocument(documentName: string, documentData: string[], url: string) {
    this.isPrinting = true;
    this.printingStatus.next(this.isPrinting);
    this.router.navigate([url, { outlets: {
          print: ['print', documentName, documentData.join()]
        }}]);
  }

  onDataReady() {
    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.printingStatus.next(this.isPrinting);
      this.location.back();
    });
  }
}
