import { Component } from '@angular/core';
import { preserveWhitespacesDefault, splitClasses } from '@angular/compiler';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public items = [
    [
      { name: 'fries', title: 'Fries', quantity: 10, price: 1.25 },
      { name: 'burger_single', title: 'Single Patty Burger', quantity: 10, price: 2 },
      { name: 'burger_double', title: 'Double Patty Burger', quantity: 10, price: 2.25 },
    ],
    [
      { name: 'sundae', title: 'Sundae', quantity: 10, price: .75 },
      { name: 'choco_fudge', title: 'Choco Fudge', quantity: 10, price: 1.25 },
      { name: 'strawberry_fudge', title: 'Strawberry Fudge', quantity: 10, price: 1.25 },
    ]
  ];

  public cartItems = [];
  public cart = [];

  public orderSuccess = false;
  public submitting = false;
  public submittedResponse;

  private websocket;

  constructor() {

    let factory;
    try {
      factory = new WebSocketFactory();
      this.websocket = factory.createWebSocket('ws://demos.kaazing.com/echo');

      this.websocket.onopen = (evt) => {
        console.log('CONNECTED');
      };

      this.websocket.onmessage = (evt) => {
        const data = evt.data;
        if (typeof(data) === 'string') {
          this.submitting = false;
          this.orderSuccess = true;
          this.submittedResponse = data;

          setTimeout(() => this.orderSuccess = false, 5000);
        }
      };

      this.websocket.onclose = (evt) => {
        console.log('CLOSED: (' + evt.code + ') ' + evt.reason);
      };
    } catch (e) {

    }
  }

  groupBy(collection, property) {
    let i = 0, val, index, values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1) {
          result[index].push(collection[i]);
        } else {
          values.push(val);
          result.push([collection[i]]);
        }
    }
    return result;
}

  add(rowIndex, itemIndex) {
    const item = this.items[rowIndex][itemIndex];
    this.cartItems.push(item);

    this.cart = this.groupBy(this.cartItems, 'name');
  }

  removeItem(cartIndex) {
    const item = this.cart[cartIndex].pop();
    if (this.cart[cartIndex].length === 0) {
      this.cart.splice(cartIndex, 1);
    }
    const i = this.cartItems.findIndex(cI => cI.name === item.name);
    this.cartItems.splice(i, 1);
  }

  total() {
    return this.cartItems.reduce((p, n) => (p + n.price), 0);
  }

  submit() {
    this.submitting = true;
    this.orderSuccess = false;
    this.submittedResponse = '';
    this.websocket.send(JSON.stringify({ 'event': 'purchase', 'amount': this.total() }));

    this.cart = [];
    this.cartItems = [];
  }
}
