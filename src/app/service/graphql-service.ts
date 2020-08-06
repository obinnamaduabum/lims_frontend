import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Apollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import {BehaviorSubject} from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  serverAuthenticationApi = '';
  graphql = '';

  private labTestCategoriesAndPagination: BehaviorSubject<any> = new BehaviorSubject(undefined);

  constructor(private httpClient: HttpClient,
              private apollo: Apollo,
              private httpLink: HttpLink) {
    if (environment.production) {
      this.serverAuthenticationApi = environment.serverAuthenticationApi;
      this.graphql = environment.graphql;
    } else {
      this.graphql = environment.graphql;
    }

    apollo.create({
      link: httpLink.create({uri: this.graphql + '/graphql'}),
      cache: new InMemoryCache()
    });
  }


  makeApiCallForLabTestCategoriesAndPagination = () => {
    this.apollo.query({
      query: gql`query
      {
      labTestCategories {
          name
          labTestPojos {
            id
            categoryName
            currencyType
            name
            price
            code
          }
        }
        pagination {
          length
          pageSize
          pageNumber
          dataList {
            id
            categoryName
            currencyType
            name
            price
            code
          }
        }
        adminSettings {
    id

    dropBoxActive

    dataStorageProduction

    currencyType

    accountVerificationSmsCount

    afterHoursPermitSendingOfSms

    afterHoursPermitUserLoginAfterFailedAttempts

    multiTexterNumberOfUnits

    multiTexterUnitsPerText

    numberOfLoginAttemptsAllowedForAUser
  }
        }`
    }).subscribe(result => {
      // console.log(result);
      this.labTestCategoriesAndPagination.next(result);
      return result;
    });
  }


  getLabTestCategoriesAndPagination() {
    this.makeApiCallForLabTestCategoriesAndPagination();
    return this.labTestCategoriesAndPagination.asObservable();
  }
}
