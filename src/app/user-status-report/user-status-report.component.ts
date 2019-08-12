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
      this.user = user;
      if (this.user) {
        let ref = firebase.database().ref('users/');
        ref.orderByChild('uid').equalTo(this.user.uid).limitToFirst(1).on("child_added", snapshot => {
          this.db.getUserById(snapshot.key).valueChanges().subscribe(result => {
            this.userObjFromDb = result;
            this.db.hasUserPaid(this.userObjFromDb.id).valueChanges().pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
              if(status){ //TODO this used to be status.$value, but wit this refactor might be broken now https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md
                console.log("user has paid");
                this.togglePaid(this.userObjFromDb.id);
                this.togglePayMentPrompt(false);
                this.paidStatus = status;
              } else{
                console.log("user has not paid");
                this.togglePayMentPrompt(true);
                this.paidStatus = false;
              }
            });

            this.db.getDateSinceAnnotated(this.userObjFromDb.id).valueChanges().pipe(takeUntil(this.ngUnsubscribe)).subscribe(date =>{
              let dateLastAnnotated: Date = new Date(date.toString()); //TODO this used to be date.$value, but wit this refactor might be broken now https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md
              if(dateLastAnnotated.toString() != "Invalid Date"){
                console.log("yes");
                let daysSinceLastAnnotation: number = this.calculateDaysSinceLastAnnotation(dateLastAnnotated);
                console.log(daysSinceLastAnnotation);
                if(daysSinceLastAnnotation <= constants.numDaysBeforeNewAnnotationNeeded){
                  console.log("leak!");
                  this.togglePaid(this.userObjFromDb.id);
                } else{
                  this.toggleAnnotationPrompt(true);
                }
              } else{
                this.toggleAnnotationPrompt();
              }
            });
          });
        });
      }
    });
  }

  ngOnDestroy(){
    // this.authService.unsubscribe();
  }

  calculateDaysSinceLastAnnotation(date: Date){ //TODO move to service
    let today: Date = new Date();
    let parsedToday = this.parseDate(today);
    let parsedAnnotationDate = this.parseDate(date);
    let numDays = this.datediff(parsedAnnotationDate, parsedToday);
    return numDays;
  }

  parseDate(str) { //TODO move to service
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0]-1, mdy[1]);
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

  togglePaid(userId: string){
    this.db.updateUserPaymentStatus(userId, true);
    console.log("paidStatus changed to true");
  }

  togglePayMentPrompt(status: boolean){
    if(status){
      console.log("bitch better have my money");
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
