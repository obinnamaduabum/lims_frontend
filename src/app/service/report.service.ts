import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {saveAs} from 'file-saver';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }
  }

  generatePatientReceipt(value: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/report/patient/receipt/` + value + `?doc_type=` + 'pdf', httpOptions).pipe(map((data: any) => {
      return data;
    }));
  }

  downloadPatientReceiptPDF(value: any, docType: string): Observable<any> {
    const url = this.serverAuthenticationApi + `/v1/api/protected/default/report/patient/receipt/` + value + `?doc_type=` + docType;
    let application;
    let downloadName;
    if (docType === 'PDF') {
      application = 'application/pdf';
      downloadName = 'download.pdf';
    } else if (docType === 'EXCEL') {
      application = 'application/vnd.ms-excel';
      downloadName = 'download.xls';
    }
    return this.httpClient.post(url, value, {responseType: 'blob', headers: {Accept: application}}).pipe(map((blob: any) => {
      return {
        blob,
        downloadName
      };
    }));
  }



  downloadPatientReceiptPDFForAdmin(value: any, docType: string): void {
    const url = this.serverAuthenticationApi + `/v1/api/protected/default/report/patient/receipt/for-admin/`
      + value + `?doc_type=` + docType;
    let application;
    let downloadName;
    if (docType === 'PDF') {
      application = 'application/pdf';
      downloadName = 'download.pdf';
    } else if (docType === 'EXCEL') {
      application = 'application/vnd.ms-excel';
      downloadName = 'download.xls';
    }
    this.httpClient.post(url, value, {responseType: 'blob', headers: {Accept: application}})
      .subscribe(blob => {
        saveAs(blob, downloadName);
      });
  }

}
