import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

import { AngularFireFunctions } from '@angular/fire/functions';
import { takeUntil, switchMap } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { AuthorizationService } from '../authorization.service';
import { masterStripeConfig } from '../api-keys';
import { constants } from '../constants';
import { TextTransformationService } from '../text-transformation.service';
import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';

declare var Stripe; //: stripe.StripeStatic;

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss'],
})
export class StripeComponent extends BaseComponent implements OnInit {

  @ViewChild('cardElement', {static: true}) cardElement: ElementRef;
  private localTitle = constants.title;
  private localPaymentStatus: any = false;
  private localUserNodId: string = null;

  private stripe;
  private card;
  private cardErrors;
  private loading = false;
  private confirmation;
  private subscriptionCost: number = constants.monthlyCost;
  private subscriptionStatus: string = ''

  constructor(private authService: AuthorizationService, private functions:AngularFireFunctions, private textTransformationService: TextTransformationService, private dbService: DatabaseService, private trackerService : TrackerService) {
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

    let pymnStats = this.trackerService.currentUserBehaviorSubject.pipe(switchMap((user)=>(user ? this.dbService.hasUserPaid(user.id): this.handleNoUser())));
    pymnStats.pipe(takeUntil(this.ngUnsubscribe)).subscribe(paymentStatus =>{
      console.log("results of hasUserPaid");
      console.log(paymentStatus);
      this.localPaymentStatus = paymentStatus;
    });
  }

  async handleForm(e){
    this.subscriptionStatus = "Processing...";
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
      // console.log("user retrieved:");
      // console.log(user);
      const subscriptionFun = this.functions.httpsCallable('stripeCreateSubscription');
      // console.log("subscriptionFun made");
      const res = await subscriptionFun({ plan: 'plan_GBak65OXFnPtcD', source: source.id }).toPromise();
      console.log("res is:");
      console.log(res);
      if(res){
        this.subscriptionStatus = "Subscription is " + this.textTransformationService.capitalizeFirstLetter(res.status);
        // const webhookFun = this.functions.httpsCallable('invoiceWebhookEndpoint');
        // const webhookRes = await webhookFun({customer: res.customer, subscription: res.id}).toPromise();
        // console.log("webhookRes");
        // console.log(webhookRes);
        this.loading = false;
      }
    }
  }

  handleNoUser(){
    console.log("ack no user!");
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
