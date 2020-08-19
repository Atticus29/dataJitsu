import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import * as firebase from 'firebase/app';

import { Subject, of } from 'rxjs';
import { takeUntil, take, switchMap } from 'rxjs/operators';

import { AuthorizationService } from '../authorization.service';
import { DateCalculationsService } from '../date-calculations.service';
import { constants } from '../constants';
import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';
import { User } from '../user.model';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-user-status-report',
  templateUrl: './user-status-report.component.html',
  styleUrls: ['./user-status-report.component.scss']
})
export class UserStatusReportComponent extends BaseComponent implements OnInit {
  // private ngUnsubscribe: Subject<void> = new Subject<void>();
  user: User = null;
  userLoggedIn: boolean = false;
  userObjFromDb;
  shouldAnnotate: boolean = false;
  paidStatus: any = false;
  private notificationsSeen: boolean = false;

  constructor(private authService: AuthorizationService, private dbService: DatabaseService, private router: Router, private cdr: ChangeDetectorRef, private trackerService: TrackerService, private dateCalculationsService: DateCalculationsService, public ngZone: NgZone) {
    super();
  }

  ngOnInit() {
    try{
      let pymnStats = this.trackerService.currentUserBehaviorSubject.pipe(switchMap((user)=>(user? this.dbService.hasUserPaid(user.id): of(false))));
      pymnStats.pipe(takeUntil(this.ngUnsubscribe)).subscribe(paymentStatus =>{
        this.paidStatus = paymentStatus;
      });
    }catch(err){
      // console.log("fetching payment status failed. Error caught");
      // console.log(err);
    }


    // console.log("ngOnInit user-status-report is called");
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user: User)=>{
      this.user = user;
      if (this.user) {
        this.userLoggedIn = true;
        if(this.user.uid){
          this.dbService.getUserByUid(this.user.uid).pipe(take(1)).subscribe(dbUser =>{
            this.userObjFromDb = dbUser;
            // this.togglePaymentThings();
            this.dbService.userHasAnnotatedEnough(this.userObjFromDb.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(hasUserAnnotatedEnough =>{
              // console.log("results of userHasAnnotatedEnough call in user-status-report component: ");
              // console.log(hasUserAnnotatedEnough);
              // if(!hasUserAnnotatedEnough){
              //   this.toggleAnnotationPrompt(true);
              //   this.togglePayMentPrompt(true);
              // } else{
              //   this.toggleAnnotationPrompt(false);
              //   this.togglePayMentPrompt(false);
              // }
            });
          });
        }
      } else{
        this.userLoggedIn = false;
      }
    });
  }

  ngOnDestroy(){
    // this.authService.unsubscribe();
  }


  toggleAnnotationPrompt(status: boolean){
    //TODO flesh out
    if(status){
      this.shouldAnnotate = true;
    } else{
      this.shouldAnnotate = false;
    }
  }

  // togglePaid(userId: string, status: boolean){
  //   console.log("paidStatus changed to " + status);
  //   this.dbService.updateUserPaymentStatus(userId, status);
  //   //TODO other stuff?
  // }

  togglePayMentPrompt(status: boolean){
    if(status){
      // console.log("bitch better have my money");
      this.shouldAnnotate = true;
    } else{
      this.shouldAnnotate = false;
    }
  }

  sendToMatchToAnnotate(){
    this.dbService.getLowRatedVideo().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
      this.ngZone.run(() =>{
        this.router.navigate([constants.allVideosPathName+result.id]);
      });
    });
  }

  // sendToMatchToPaymentSubscription(){
  //
  //   this.router.navigate(['payment']);
  // }

  // togglePaymentThings(){
  //   this.dbService.hasUserPaid(this.userObjFromDb.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
  //     if(status == true){
  //       // console.log("user has paid");
  //       // this.togglePaid(this.userObjFromDb.id, true);
  //       this.togglePayMentPrompt(false);
  //       this.paidStatus = status;
  //     } else{
  //       // console.log("user has not paid");
  //       // this.togglePaid(this.userObjFromDb.id, false);
  //       this.togglePayMentPrompt(true);
  //       this.paidStatus = false;
  //     }
  //   });
  // }

  toggleNotificationsSeenToTrue(){
    this.notificationsSeen = true;
  }

  sendToPaymentSubscription(){
    this.ngZone.run(() =>{
      this.router.navigate(['payment']);
    });
  }

navigateToVideoInNeedOfAnnotation(){
  this.dbService.getMatchInNeedOfAnnotation().pipe(take(1)).subscribe(match =>{
    this.ngZone.run(() =>{
      this.router.navigate([constants.allVideosPathName + match.id]);
    });
  });
}

}
