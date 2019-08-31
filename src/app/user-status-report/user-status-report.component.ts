import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import * as firebase from 'firebase/app';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

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

  constructor(private authService: AuthorizationService, private db: DatabaseService, private router: Router, private cdr: ChangeDetectorRef, private trackerService: TrackerService, private dateService: DateCalculationsService) {
    super();
  }

  ngOnInit() {
    // console.log("ngOnInit user-status-report is called");
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user: User)=>{
      this.user = user;
      if (this.user) {
        this.userLoggedIn = true;
        if(this.user.uid){
          this.db.getUserByUid(this.user.uid).pipe(take(1)).subscribe(dbUser =>{
            this.userObjFromDb = dbUser;
            this.togglePaymentThings();
            this.db.userHasAnnotatedEnough(this.userObjFromDb.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(hasUserAnnotatedEnough =>{
              // console.log("results of userHasAnnotatedEnough call in user-status-report component: ");
              // console.log(hasUserAnnotatedEnough);
              if(!hasUserAnnotatedEnough){
                this.toggleAnnotationPrompt(true);
                this.togglePayMentPrompt(true);
              } else{
                this.toggleAnnotationPrompt(false);
                this.togglePayMentPrompt(false);
              }
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

  togglePaid(userId: string, status: boolean){
    console.log("paidStatus changed to " + status);
    this.db.updateUserPaymentStatus(userId, status);
    //TODO other stuff?
  }

  togglePayMentPrompt(status: boolean){
    if(status){
      // console.log("bitch better have my money");
      this.shouldAnnotate = true;
    } else{
      this.shouldAnnotate = false;
    }
  }

  sendToMatchToAnnotate(){
    this.db.getLowRatedMatch().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
      this.router.navigate(['matches/'+result.id]);
    });
  }

  sendToMatchToPaymentSubscription(){
    this.router.navigate(['payment']);
  }

  togglePaymentThings(){
    this.db.hasUserPaid(this.userObjFromDb.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
      if(status == true){
        // console.log("user has paid");
        // this.togglePaid(this.userObjFromDb.id, true);
        this.togglePayMentPrompt(false);
        this.paidStatus = status;
      } else{
        // console.log("user has not paid");
        // this.togglePaid(this.userObjFromDb.id, false);
        this.togglePayMentPrompt(true);
        this.paidStatus = false;
      }
    });
  }


}
