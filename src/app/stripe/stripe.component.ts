import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AngularFireFunctions } from '@angular/fire/functions';
import { takeUntil, switchMap, first } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';

import { BaseComponent } from '../base/base.component';
import { masterStripeConfig } from '../api-keys';
import { constants } from '../constants';
import { User } from '../user.model';
import { AuthorizationService } from '../authorization.service';
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
  private localUserNodeId: string = null;

  private stripe;
  private card;
  private loading = false;
  private confirmation;
  private subscriptionCost: number = constants.monthlyCost;
  private subscriptionStatus: string = ''
  private cardErrors: string = '';

  constructor(private authService: AuthorizationService, private functions:AngularFireFunctions, private textTransformationService: TextTransformationService, private dbService: DatabaseService, private trackerService : TrackerService, public snackBar: MatSnackBar, public afAuth: AngularFireAuth) {
    super();
  }

  ngOnInit() {
    combineLatest(this.authService.currentUserObservable, this.afAuth.authState).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      let result = results[0];
      let authState = results[1];
      if(result && result.uid && authState){
        this.dbService.getUserByUid(result.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((dbUser: User) =>{
          // this.dbService.getUserReputationPoints(dbUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(repPoints =>{
          //   this.localReputation = Number(repPoints); //TODO this is the only part that is not in base component...experiment with putting it in there
          // });
          this.trackerService.currentUserBehaviorSubject.next(dbUser); //this should be the ONLY emission to currentUserObservable app-wide!
          this.userObjFromDb = dbUser;
        });
      } else{
        this.trackerService.currentUserBehaviorSubject.next(null);
      }
    });

    this.stripe = Stripe(masterStripeConfig.publicApiKey);
    const elements = this.stripe.elements();

    this.card = elements.create('card');
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({ error }) =>{
      this.cardErrors = error && error.message;
    });

    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user =>{
      // console.log("user in currentUserBehaviorSubject:");
      // console.log(user);
      if(user){
        if(user.id){
          this.localUserNodeId = user.id;
          let pymnStats = this.trackerService.currentUserBehaviorSubject.pipe(switchMap((user)=>(this.dbService.hasUserPaid(user.id))));
          pymnStats.pipe(takeUntil(this.ngUnsubscribe)).subscribe(paymentStatus =>{
            // console.log("payment status in switchMap is " + paymentStatus);
            if(paymentStatus && !this.localPaymentStatus){
              //TODO figure out a way to capture the when paymentStatus first becomes true (localPaymentStatus will always be false upon page reload)
              // this.openSnackBar("Congratulations! You have a subscription to " + constants.title +", and you have access to all matches and accumulated data about them!");
            }
            if(paymentStatus){
              this.localPaymentStatus = true;
            }
          });
        }
      }
    });
  }

  async handleForm(e){
    // console.log("handleForm called")
    this.subscriptionStatus = "Processing...";
    e.preventDefault();
    const { source, error } = await this.stripe.createSource(this.card);
    if(error){
      console.log("error getting source");
      this.cardErrors = error.message;
      this.openSnackBar(error.message);
      this.subscriptionStatus = '';
    } else{
      console.log("got beyond source");
      this.loading = true;
      const user = await this.authService.getUser(); //TODO define this
      const subscriptionFun = this.functions.httpsCallable('stripeCreateSubscription');
      try{
        const res = await subscriptionFun({ plan: constants.stipePlanId, source: source.id }).toPromise();
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

  async cancelSubscription(e){
    let confirmation = confirm("Are you sure you want to cancel your very affordable subscription to this great service?");
    if(confirmation){
      // console.log("cancelSubscription called")
      this.subscriptionStatus = "Processing...";
      e.preventDefault();
      // console.log(this.localUserNodeId);
      const subId = await this.dbService.getSubscriptionIdFromUser(this.localUserNodeId).pipe(first()).toPromise(); //.subscribe(subId =>{  pipe(takeUntil(this.ngUnsubscribe)).
        // console.log(subId);
        const cancelSubscriptionFun = this.functions.httpsCallable('stripeCancelSubscription');
        try{
          const res = await cancelSubscriptionFun({ subId: subId}).toPromise();
          // console.log(res);
          if(res){
            this.subscriptionStatus = "Subscription is " + this.textTransformationService.capitalizeFirstLetter(res.status);
            this.openSnackBar(this.subscriptionStatus);
            this.loading = false;
            this.localPaymentStatus = false;
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
