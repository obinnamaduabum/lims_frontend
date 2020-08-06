import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LabTestCategoriesService {

  serverAuthenticationApi = '';
  constructor(private httpClient: HttpClient) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
    }
  }

  uploadLabTestCategory(fileToUpload: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileToUpload);
    return this.httpClient.post(this.serverAuthenticationApi + `/v1/api/protected/default/lab-category/category/upload`, formData)
      .pipe(map((data: any) => {
        return data;
      }));
  }

  uploadLabTest(fileToUpload: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', fileToUpload);
    return this.httpClient.post(this.serverAuthenticationApi + `/v1/api/protected/default/lab-test/test/upload`, formData)
      .pipe(map((data: any) => {
        return data;
      }));
  }


  getLabCategories(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/public/default/lab-category`)
      .pipe(map((data: any) => {
        return data;
      }));
  }



  getLabTestsFromLabCategories(id: number): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/public/default/lab-category/fetch-lab-tests/` + id)
      .pipe(map((data: any) => {
        return data;
      }));
  }





  getLabCategoriesAndTests(): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi + `/v1/api/public/default/lab-category-and-tests`)
      .pipe(map((data: any) => {
        return data;
      }));
  }



  searchLabCategoriesAndTests(value: any, page: number, size: number): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/public/default/lab-test/lab-category-and-tests?page=` + page + `&size=` + size, value)
      .pipe(map((data: any) => {
        return data;
      }));
  }


  filteredSearchLabCategoriesAndTests(value: any, page: number, size: number): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/public/default/lab-test/lab-category-and-tests?page=` + page + `&size=` + size, value)
      .pipe(map((data: any) => {
        return data;
      }));
  }


  assignToTemplate(value: any): Observable<any> {
    return this.httpClient.post(this.serverAuthenticationApi +
      `/v1/api/protected/default/lab-category/assign-to-template`, value)
      .pipe(map((data: any) => {
        return data;
      }));
  }



  fetchAssignmentHistory(id: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/lab-category/assign/history-by-actual-latest-id/` + id)
      .pipe(map((data: any) => {
        return data;
      }));
  }



  fetchAssignmentHistoryByTemplateId(id: any): Observable<any> {
    return this.httpClient.get(this.serverAuthenticationApi +
      `/v1/api/protected/default/lab-category/assign/history-by-template-id/` + id)
      .pipe(map((data: any) => {
        return data;
      }));
  }








// .pipe(startWith(null),
//   debounceTime(200),
//   distinctUntilChanged(),
//   map((data) => {
//   return data;
// }));
}
