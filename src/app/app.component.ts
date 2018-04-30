import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { AuthorizationService } from './authorization.service';
import { ProtectionGuard } from './protection.guard';
import { constants } from './constants'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[AuthorizationService, ProtectionGuard]
})
export class AppComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  user: any = null;
  userObjFromDb;
  paidStatus: any = null;
  shouldAnnotate: boolean = false;

  constructor(private authService: AuthorizationService, private db: DatabaseService){}

  ngOnInit() {
    this.paidStatus = false;
    //TODO put this in a try catch and send to error page upon catch
    this.authService.getCurrentUser()
    .takeUntil(this.ngUnsubscribe).subscribe(user=>{
      this.user = user;
      // console.log(this.user.uid);
      if (this.user) {
        this.db.getUserByUid(this.user.uid)
        // .takeUntil(this.ngUnsubscribe)
        //remove subscribe??
        .then(dbuser=>{
          //TODO check whether user has paid or has annotated in the past x days
          this.db.hasUserPaid(dbuser).takeUntil(this.ngUnsubscribe).subscribe(status =>{
            if(status){
              this.togglePaid(dbuser);
            } else{
              this.togglePayMentPrompt();
            }
          });
          this.db.getDaysSinceAnnotated(dbuser).takeUntil(this.ngUnsubscribe).subscribe(days =>{
            if(days <= constants.numDaysBeforeNewAnnotationNeeded){
              this.togglePaid(dbuser);
            } else{
              this.toggleAnnotationPrompt();
            }
          });
          console.log("about to print dbuser");
          console.log(dbuser);
          this.userObjFromDb = dbuser;
        });
      }
    });
  }

  loginGoogleComponent(){
    this.authService.loginGoogle();
  }

  toggleAnnotationPrompt(){
    //TODO flesh out
    this.shouldAnnotate = true;
  }

  togglePaid(userId: string){
    this.db.updateUserPaymentStatus(userId, true);
    this.paidStatus = true;
  }

  togglePayMentPrompt(){
    //TODO flesh out
  }

  logout(){
    this.authService.logout();
    this.authService.user = null;
    this.authService.setAuthenticated(false);
    // console.log(this.authService.user);
  }


}
