import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthorizationService } from '../authorization.service';
import * as firebase from 'firebase/app';
import { constants } from '../constants';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-user-status-report',
  templateUrl: './user-status-report.component.html',
  styleUrls: ['./user-status-report.component.scss']
})
export class UserStatusReportComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  user: any = null;
  userLoggedIn: boolean = false;
  userObjFromDb;
  shouldAnnotate: boolean = false;
  paidStatus: any = false;

  constructor(private authService: AuthorizationService, private db: DatabaseService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // this.db.hasUserPaid()
    // console.log("ngOnInit user-status-report is called");
    // this.paidStatus = false;
    //TODO put this in a try catch and send to error page upon catch
    this.authService.currentUserObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user=>{
      // console.log("user in authService of user-status-report: ");
      // console.log(user);
      this.user = user;
      if (this.user) {
        this.userLoggedIn = true;
        let ref = firebase.database().ref('users/');
        ref.orderByChild('uid').equalTo(this.user.uid).limitToFirst(1).on("child_added", snapshot => {
          this.db.getUserById(snapshot.key).valueChanges().subscribe(result => {
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

            this.db.getDateSinceAnnotated(this.userObjFromDb.id).valueChanges().pipe(takeUntil(this.ngUnsubscribe)).subscribe(date =>{
              console.log("getDateSinceAnnotated call in user-status-report: ");
              console.log(date);
              let dateLastAnnotated: Date = new Date(date.toString()); //TODO this used to be date.$value, but wit this refactor might be broken now https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md
              if(dateLastAnnotated.toString() != "Invalid Date"){ //dateLastAnnotated.toString()
                // console.log("yes");
                let daysSinceLastAnnotation: number = this.calculateDaysSinceLastAnnotation(dateLastAnnotated);
                // console.log(daysSinceLastAnnotation);
                if(daysSinceLastAnnotation <= constants.numDaysBeforeNewAnnotationNeeded){
                  // console.log("leak!");
                  this.toggleAnnotationPrompt(false);
                } else{
                  this.toggleAnnotationPrompt(true);
                }
              } else{
                console.log("this shouldn't happen user-status-report date is invalid");
                this.toggleAnnotationPrompt(true); //TODO should this be a thing??? Not clear when this happens
              }
            });
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

  calculateDaysSinceLastAnnotation(date: Date){ //TODO move to service
    let today: string = new Date().toJSON();
    // console.log("today");
    // console.log(today);
    let parsedToday = this.parseDate(today);
    // console.log("parsedToday");
    // console.log(parsedToday);
    let parsedAnnotationDate = this.parseDate(date.toJSON());
    let numDays = this.datediff(parsedAnnotationDate, parsedToday);
    // console.log("numDays: " + numDays);
    return numDays;
  }

  parseDate(str: string) { //TODO move to service
    let mdy = str.split('-');
    // console.log(mdy);
    // console.log(mdy[0]);
    // console.log(mdy[1]);
    // console.log(mdy[2].substring(0,2));
    return new Date(Number(mdy[0]), Number(mdy[1])-1, Number(mdy[2].substring(0,2)));
  }

  datediff(first, second) { //TODO move to service
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
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
