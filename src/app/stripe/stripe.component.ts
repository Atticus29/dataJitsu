import { Component, OnInit } from '@angular/core';
import { masterStripeConfig } from '../api-keys';
import { constants } from '../constants';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss'],
})
export class StripeComponent implements OnInit {
  private localTitle = constants.title;

  constructor() { }

  ngOnInit() {
  }

  openCheckout() {
  var handler = (<any>window).StripeCheckout.configure({
      key: masterStripeConfig.publicApiTestKey,
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
      }
    });

    handler.open({
      name: this.localTitle + ' Subscription',
      description: 'Monthly',
      amount: 200
    });

  }

}
