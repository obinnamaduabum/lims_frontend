import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {TestModel} from '../models/test-model';

@Injectable({
  providedIn: 'root'
})
export class MyCookieService {

  itemsInCartKey = 'items-in-cart';
  private shoppingCartData: BehaviorSubject<TestModel[]> = new BehaviorSubject(undefined);

  constructor() {
    if (localStorage.getItem(this.itemsInCartKey)) {
      const testsAddedToCart = JSON.parse(localStorage.getItem(this.itemsInCartKey));
      this.shoppingCartData.next(testsAddedToCart);
    } else {
      const initialData: TestModel[] = [];
      this.shoppingCartData.next(initialData);
    }
  }

  setShoppingCartData(value: TestModel) {

    let foundItem;
    let testsAddedToCart: TestModel[] = [];
    if (this.shoppingCartData.getValue()) {
      testsAddedToCart = this.shoppingCartData.getValue();
      foundItem = this.checkIfItemExists(testsAddedToCart, value.code);
    } else if (localStorage.getItem(this.itemsInCartKey)) {
      testsAddedToCart = JSON.parse(localStorage.getItem(this.itemsInCartKey));
      foundItem = this.checkIfItemExists(testsAddedToCart, value.code);
    }

    if (foundItem) {
      const index = testsAddedToCart.findIndex(item => item.code.toLowerCase() === value.code.toLowerCase());
      testsAddedToCart[index].quantity++;
      testsAddedToCart[index].total = testsAddedToCart[index].price * testsAddedToCart[index].quantity;
    } else {
      // console.log('code came here');
      value.quantity = +1;
      value.total = value.price * value.quantity;
      testsAddedToCart.push(value);
    }

    this.shoppingCartData.next(testsAddedToCart);
    const convertToString = JSON.stringify(testsAddedToCart);
    localStorage.setItem(this.itemsInCartKey, convertToString);
  }

  setShoppingCartDataForInstitution(value: TestModel) {

   // let foundItem;
    let testsAddedToCart: TestModel[] = [];
    if (this.shoppingCartData.getValue()) {
      testsAddedToCart = this.shoppingCartData.getValue();
      // foundItem = this.checkIfItemExists(testsAddedToCart, value.code);
    } else if (localStorage.getItem(this.itemsInCartKey)) {
      testsAddedToCart = JSON.parse(localStorage.getItem(this.itemsInCartKey));
      // foundItem = this.checkIfItemExists(testsAddedToCart, value.code);
    }
    console.log('code came here');
    value.quantity = +1;
    value.total = value.price * value.quantity;
    testsAddedToCart.push(value);

    this.shoppingCartData.next(testsAddedToCart);
    const convertToString = JSON.stringify(testsAddedToCart);
    localStorage.setItem(this.itemsInCartKey, convertToString);
  }



  updateShoppingCartDataForInstitution(value: TestModel) {

    let foundItem;
    let testsAddedToCart: TestModel[] = [];
    if (this.shoppingCartData.getValue()) {
      testsAddedToCart = this.shoppingCartData.getValue();
      foundItem = this.checkIfItemExistsByRandomCode(testsAddedToCart, value.randomCode);
    } else if (localStorage.getItem(this.itemsInCartKey)) {
      testsAddedToCart = JSON.parse(localStorage.getItem(this.itemsInCartKey));
      foundItem = this.checkIfItemExistsByRandomCode(testsAddedToCart, value.randomCode);
    }
    if (foundItem) {
      const index = testsAddedToCart.findIndex(item => item.randomCode.toLowerCase() === value.randomCode.toLowerCase());
      // testsAddedToCart[index].quantity++;
      // testsAddedToCart[index].total = testsAddedToCart[index].price * testsAddedToCart[index].quantity;

      testsAddedToCart[index].firstName = value.firstName;
      testsAddedToCart[index].lastName = value.lastName;
      testsAddedToCart[index].otherName = value.otherName;
      testsAddedToCart[index].fileNumber = value.fileNumber;
      testsAddedToCart[index].selectedPhoneNumber = value.selectedPhoneNumber;
      testsAddedToCart[index].phoneNumber = value.phoneNumber;
    }

    this.shoppingCartData.next(testsAddedToCart);
    const convertToString = JSON.stringify(testsAddedToCart);
    localStorage.setItem(this.itemsInCartKey, convertToString);
  }

  getShoppingCartList(): Observable<any[]> {
    return this.shoppingCartData.asObservable();
  }

  checkIfItemExists(testArray: TestModel[], code: string) {
    const result = testArray.filter(value => value.code.toLowerCase().includes(code.toLocaleLowerCase()));
    if (result.length > 0) {
      return result;
    }
    return;
  }


  checkIfItemExistsByRandomCode(testArray: TestModel[], randomCode: string) {
    const result = testArray.filter(value => value.randomCode.toLowerCase().includes(randomCode.toLocaleLowerCase()));
    if (result.length > 0) {
      return result;
    }
    return;
  }

  removeItem(test: TestModel) {
    let testsAddedToCart: TestModel[] = [];
    if (this.shoppingCartData.getValue()) {
      testsAddedToCart = this.shoppingCartData.getValue();
    } else if (localStorage.getItem(this.itemsInCartKey)) {
      testsAddedToCart = JSON.parse(localStorage.getItem(this.itemsInCartKey));
    }
    const index = testsAddedToCart.findIndex(item => item.code.toLowerCase() === test.code.toLowerCase());
    testsAddedToCart.splice(index, 1);
    this.shoppingCartData.next(testsAddedToCart);
    const convertToString = JSON.stringify(testsAddedToCart);
    localStorage.setItem(this.itemsInCartKey, convertToString);
  }


  removeItemForInstitution(test: TestModel) {
    let testsAddedToCart: TestModel[] = [];
    if (this.shoppingCartData.getValue()) {
      testsAddedToCart = this.shoppingCartData.getValue();
    } else if (localStorage.getItem(this.itemsInCartKey)) {
      testsAddedToCart = JSON.parse(localStorage.getItem(this.itemsInCartKey));
    }
    if (testsAddedToCart) {
      const index = testsAddedToCart.findIndex(item => item.randomCode.toLowerCase() === test.randomCode.toLowerCase());
      testsAddedToCart.splice(index, 1);
      this.shoppingCartData.next(testsAddedToCart);
      const convertToString = JSON.stringify(testsAddedToCart);
      localStorage.setItem(this.itemsInCartKey, convertToString);
    }
  }

  increaseItemQuantity(value: TestModel) {
    let foundItem;
    let testsAddedToCart: TestModel[] = [];
    if (this.shoppingCartData.getValue()) {
      testsAddedToCart = this.shoppingCartData.getValue();

      console.log(this.shoppingCartData.getValue());
      console.log(value.code);
      foundItem = this.checkIfItemExists(testsAddedToCart, value.code);
    } else if (localStorage.getItem(this.itemsInCartKey)) {
      testsAddedToCart = JSON.parse(localStorage.getItem(this.itemsInCartKey));
      foundItem = this.checkIfItemExists(testsAddedToCart, value.code);
    }

    if (foundItem) {

      const index = testsAddedToCart.findIndex(item => item.code.toLowerCase() === value.code.toLowerCase());
      testsAddedToCart[index].quantity++;
      testsAddedToCart[index].total = testsAddedToCart[index].price * testsAddedToCart[index].quantity;
    }
    // console.log(testsAddedToCart);
    this.shoppingCartData.next(testsAddedToCart);
    const convertToString = JSON.stringify(testsAddedToCart);
    localStorage.setItem(this.itemsInCartKey, convertToString);
  }

  decreaseItemQuantity(value: TestModel) {
    let foundItem;
    let testsAddedToCart: TestModel[] = [];
    if (this.shoppingCartData.getValue()) {
      testsAddedToCart = this.shoppingCartData.getValue();

      console.log(this.shoppingCartData.getValue());
      console.log(value.code);
      foundItem = this.checkIfItemExists(testsAddedToCart, value.code);
    } else if (localStorage.getItem(this.itemsInCartKey)) {
      testsAddedToCart = JSON.parse(localStorage.getItem(this.itemsInCartKey));
      foundItem = this.checkIfItemExists(testsAddedToCart, value.code);
    }

    if (foundItem) {
      const index = testsAddedToCart.findIndex(item => item.code.toLowerCase() === value.code.toLowerCase());
      testsAddedToCart[index].quantity--;
      testsAddedToCart[index].total = testsAddedToCart[index].price * testsAddedToCart[index].quantity;
    }

    // console.log(testsAddedToCart);

    this.shoppingCartData.next(testsAddedToCart);
    const convertToString = JSON.stringify(testsAddedToCart);
    localStorage.setItem(this.itemsInCartKey, convertToString);
  }


  clearShoppingCartData() {
    this.shoppingCartData.next([]);
  }
}
