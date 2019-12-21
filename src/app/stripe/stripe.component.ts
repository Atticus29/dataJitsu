import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

import { BaseComponent } from '../base/base.component';
import { AuthorizationService } from '../authorization.service';
import { masterStripeConfig } from '../api-keys';
import { constants } from '../constants';

declare var Stripe; //: stripe.StripeStatic;

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss'],
})
export class StripeComponent extends BaseComponent implements OnInit {

  @ViewChild('cardElement', {static: true}) cardElement: ElementRef;
  private localTitle = constants.title;

  private stripe;
  private card;
  private cardErrors;
  private loading = false;
  private confirmation;
  private subscriptionCost: number = constants.monthlyCost;

  constructor(private authService: AuthorizationService, private functions:AngularFireFunctions) {
    super();
  }

  ngOnInit() {
    this.stripe = Stripe('pk_test_NKyjLSwnMosdX0mIgQaRRHbS');
    const elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) =>{
      this.cardErrors = error && error.message;
    });
  }

  async handleForm(e){
    console.log("handleForm entered");
    e.preventDefault();
    const { source, error } = await this.stripe.createSource(this.card);
    console.log("source retrieved:");
    console.log(source);
    if(error){
      const cardErrors = error.message;
    } else{
      //Send the token to the server
      this.loading = true;
      const user = await this.authService.getUser(); //TODO define this
      console.log("user retrieved:");
      console.log(user);
      const subscriptionFun = this.functions.httpsCallable('stripeCreateSubscription');
      console.log("subscriptionFun made");
      const res = await subscriptionFun({ plan: 'plan_GBak65OXFnPtcD', source: source.id });
      console.log("res is:");
      console.log(res);
      // this.confirmation = await subscriptionFun( { source: source.id, uid: user.uid, amount: this.subscriptionCost }).toPromise();
      this.loading = false;
      // const fun = this.functions.httpsCallable('stripeCreateCharge'); //TODO change?
    }
  }

  // const subscriptionFun = fun.httpsCallable('stripeCreateSubscription');
  // const subscriptionHandler = async(source) => {
  //   console.log("subscriptionHandler called");
  //   console.log(source.id);
  //   const res = await subscriptionFun({ plan: 'plan_GBak65OXFnPtcD', source: source.id });
  //   console.log("res is:");
  //   console.log(res);
  //   alert('Success, subscribed to plan');
  // }

  // openCheckout() {
  // var handler = (<any>window).StripeCheckout.configure({
  //     key: masterStripeConfig.publicApiTestKey,
  //     locale: 'auto',
  //     token: function (token: any) {
  //       // You can access the token ID with `token.id`.
  //       // Get the token ID to your server-side code for use.
  //     }
  //   });
  //
  //   handler.open({
  //     name: this.localTitle + ' Subscription',
  //     description: 'Monthly',
  //     amount: 200
  //   });
  //
  // }

}
