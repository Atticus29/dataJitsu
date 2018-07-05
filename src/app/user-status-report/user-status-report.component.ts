import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  constructor(private authService: AuthorizationService, private db: DatabaseService, private router: Router) { }

  ngOnInit() {
    console.log("ngOnInit user-status-report is called");
    this.paidStatus = false;
    //TODO put this in a try catch and send to error page upon catch
    this.authService.getCurrentUser().pipe(takeUntil(this.ngUnsubscribe)).subscribe(user=>{
      this.user = user;
      if (this.user) {
        let ref = firebase.database().ref('users/');
        ref.orderByChild('uid').equalTo(this.user.uid).limitToFirst(1).on("child_added", snapshot => {
          this.db.getUserById(snapshot.key).valueChanges().subscribe(result => {
            this.userObjFromDb = result;
            this.db.hasUserPaid(this.userObjFromDb.id).valueChanges().pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
              if(status){ //TODO this used to be status.$value, but wit this refactor might be broken now https://github.com/angular/angularfire2/blob/master/docs/version-5-upgrade.md
                this.togglePaid(this.userObjFromDb.id);
              } else{
                this.togglePayMentPrompt();
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

  // ngOnDestroy(){
  //   this.authService.unsubscribe();
  // }

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
    console.log("bitch better have my money");
    //TODO flesh out
  }

  sendToMatchToAnnotate(){
    this.db.getLowRatedMatch().subscribe(result =>{
      this.router.navigate(['matches/'+result.id]);
    });
  }


}
