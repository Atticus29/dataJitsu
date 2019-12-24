import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {MatSnackBar} from '@angular/material';

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
  private localPaymentStatus: any = true;
  private localUserNodId: string = null;

  private stripe;
  private card;
  private loading = false;
  private confirmation;
  private subscriptionCost: number = constants.monthlyCost;
  private subscriptionStatus: string = ''
  private cardErrors: string = '';

  constructor(private authService: AuthorizationService, private functions:AngularFireFunctions, private textTransformationService: TextTransformationService, private dbService: DatabaseService, private trackerService : TrackerService, public snackBar: MatSnackBar) {
    super();
  }

  ngOnInit() {
    this.stripe = Stripe(masterStripeConfig.publicApiKey);
    const elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) =>{
      this.cardErrors = error && error.message;
    });

    let pymnStats = this.trackerService.currentUserBehaviorSubject.pipe(switchMap((user)=>(this.dbService.hasUserPaid(user.id))));
    pymnStats.pipe(takeUntil(this.ngUnsubscribe)).subscribe(paymentStatus =>{
      if(paymentStatus && !this.localPaymentStatus){
        this.openSnackBar("Congratulations! You subscription has been confirmed, and you should now have access to all matches");
      }
      this.localPaymentStatus = paymentStatus;
    });
  }

  async handleForm(e){
    this.subscriptionStatus = "Processing...";
    e.preventDefault();
    const { source, error } = await this.stripe.createSource(this.card);
    if(error){
      this.cardErrors = error.message;
      this.openSnackBar(error.message);
      this.subscriptionStatus = '';
    } else{
      this.loading = true;
      const user = await this.authService.getUser(); //TODO define this
      const subscriptionFun = this.functions.httpsCallable('stripeCreateSubscription');
      try{
        const res = await subscriptionFun({ plan: 'plan_GACY9v91xQlBDf', source: source.id }).toPromise();
        if(res){
          this.subscriptionStatus = "Subscription is " + this.textTransformationService.capitalizeFirstLetter(res.status);
          this.openSnackBar(this.subscriptionStatus);
          this.loading = false;
        }
      }catch (error){
        this.openSnackBar(error.message);
        this.cardErrors = error.message;
        this.subscriptionStatus = '';
      }
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }

  // handleNoUser(){
  //   console.log("ack no user!");
  // }

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
