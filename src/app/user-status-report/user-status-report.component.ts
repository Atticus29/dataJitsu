import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import * as firebase from 'firebase/app';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthorizationService } from '../authorization.service';
import { DateCalculationsService } from '../date-calculations.service';
import { constants } from '../constants';
import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-status-report',
  templateUrl: './user-status-report.component.html',
  styleUrls: ['./user-status-report.component.scss']
})
export class UserStatusReportComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  user: User = null;
  userLoggedIn: boolean = false;
  userObjFromDb;
  shouldAnnotate: boolean = false;
  paidStatus: any = false;

  constructor(private authService: AuthorizationService, private db: DatabaseService, private router: Router, private cdr: ChangeDetectorRef, private trackerService: TrackerService, private dateService: DateCalculationsService) { }

  ngOnInit() {
    // this.db.hasUserPaid()
    // console.log("ngOnInit user-status-report is called");
    // this.paidStatus = false;
    //TODO put this in a try catch and send to error page upon catch
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user: User)=>{
      this.user = user;
      if (this.user) {
        this.userLoggedIn = true;
        let ref = firebase.database().ref('users/');
        ref.orderByChild('uid').equalTo(this.user.uid).limitToFirst(1).on("child_added", snapshot => {
          this.db.getUserById(snapshot.key).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
            this.userObjFromDb = result;
            this.db.hasUserPaid(this.userObjFromDb.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
              if(status){ //TODO this used to be status.$value, but wit this refactor might be broken now https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md
                // console.log("user has paid");
                this.togglePaid(this.userObjFromDb.id, true);
                this.togglePayMentPrompt(false);
                this.paidStatus = status;
              } else{
                // console.log("user has not paid");
                this.togglePaid(this.userObjFromDb.id, false);
                this.togglePayMentPrompt(true);
                this.paidStatus = false;
              }
            });

            this.db.userHasAnnotatedEnough(this.userObjFromDb.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(hasUserAnnotatedEnough =>{
              console.log("results of userHasAnnotatedEnough call in user-status-report component: ");
              console.log(hasUserAnnotatedEnough);
              // if()
            });

            // this.db.getDateSinceAnnotated(this.userObjFromDb.id).valueChanges().pipe(takeUntil(this.ngUnsubscribe)).subscribe(date =>{
            //   // console.log("getDateSinceAnnotated call in user-status-report: ");
            //   // console.log(date);
            //   let dateLastAnnotated: Date = new Date(date.toString());
            //   if(dateLastAnnotated.toString() != "Invalid Date"){ //dateLastAnnotated.toString()
            //     // console.log("yes");
            //     let daysSinceLastAnnotation: number = this.dateService.calculateDaysSinceLastAnnotation(dateLastAnnotated);
            //     // console.log(daysSinceLastAnnotation);
            //     if(!daysSinceLastAnnotation){
            //       this.toggleAnnotationPrompt(true);
            //     }
            //     if(daysSinceLastAnnotation <= constants.numDaysBeforeNewAnnotationNeeded){
            //       // console.log("leak!");
            //       this.toggleAnnotationPrompt(false);
            //     } else{
            //       this.toggleAnnotationPrompt(true);
            //     }
            //   } else{
            //     console.log("first timer here!");
            //     this.toggleAnnotationPrompt(true); //TODO should this be a thing??? Not clear when this happens
            //   }
            // });
          });
        });
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
    this.db.updateUserPaymentStatus(userId, status);
    console.log("paidStatus changed to " + status);
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
    this.db.getLowRatedMatch().subscribe(result =>{
      this.router.navigate(['matches/'+result.id]);
    });
  }


}
