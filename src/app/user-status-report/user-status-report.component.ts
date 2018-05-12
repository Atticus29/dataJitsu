import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { AuthorizationService } from '../authorization.service';
import * as firebase from 'firebase/app';
import { constants } from '../constants';

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
  paidStatus: any = null;

  constructor(private authService: AuthorizationService, private db: DatabaseService) { }

  ngOnInit() {
    this.paidStatus = false;
    //TODO put this in a try catch and send to error page upon catch
    this.authService.getCurrentUser()
    .takeUntil(this.ngUnsubscribe).subscribe(user=>{
      this.user = user;
      // console.log(this.user.uid);
      if (this.user) {
      // console.log(this.user.uid);
      // let temp = this.db.getUserByUid(this.user.uid);
      let ref = firebase.database().ref('users/');
      ref.orderByChild('uid').equalTo(this.user.uid).limitToFirst(1).on("child_added", snapshot => {
        this.db.getUserById(snapshot.key).subscribe(result => {
          this.userObjFromDb = result;

          //Check whether they've paid
          this.db.hasUserPaid(this.userObjFromDb.id).takeUntil(this.ngUnsubscribe).subscribe(status =>{
            console.log(status.$value);
            if(status.$value){
              this.togglePaid(this.userObjFromDb.id);
            } else{
              this.togglePayMentPrompt();
            }
          });

          //Check whether it's time to annotate a video
          this.db.getDateSinceAnnotated(this.userObjFromDb.id).takeUntil(this.ngUnsubscribe).subscribe(date =>{
            let dateLastAnnotated: Date = new Date(date.$value);
            console.log(dateLastAnnotated);
            if(dateLastAnnotated.toString() != "Invalid Date"){
              console.log("yes");
              let daysSinceLastAnnotation: number = this.calculateDaysSinceLastAnnotation(dateLastAnnotated);
              if(daysSinceLastAnnotation <= constants.numDaysBeforeNewAnnotationNeeded){
                console.log("leak!");
                this.togglePaid(this.userObjFromDb.id);
              } else{
                this.toggleAnnotationPrompt();
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

calculateDaysSinceLastAnnotation(date: Date){
  let today: Date = new Date();
  let parsedToday = this.parseDate(today);
  let parsedAnnotationDate = this.parseDate(date);
  let numDays = this.datediff(parsedAnnotationDate, parsedToday);
  return numDays;
}

parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[0]-1, mdy[1]);
}

datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
}

toggleAnnotationPrompt(){
  //TODO flesh out
  this.shouldAnnotate = true;
}

togglePaid(userId: string){
  this.db.updateUserPaymentStatus(userId, true);
  this.paidStatus = true;
  console.log("paidStatus changed to true");
}

togglePayMentPrompt(){
  //TODO flesh out
}


}
