import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { ChangeDetectorRef } from '@angular/core';

import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { constants } from './constants';
import { ProtectionGuard } from './protection.guard';
import { AuthorizationService } from './authorization.service';
import { DatabaseService } from './database.service';
import { TrackerService } from './tracker.service';
import { User } from './user.model';
import { BaseComponent } from './base/base.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[AuthorizationService, ProtectionGuard]
})
export class AppComponent extends BaseComponent implements OnInit {
  // private ngUnsubscribe: Subject<void> = new Subject<void>();
  private paidStatus: boolean = false;
  private isAdmin: boolean = false;
  user: any = null;
  private name: string = "Anonymous User";
  userObjFromDb: any = null;
  title: string = constants.title;
  authenticationStatus: boolean =false;
  shouldAnnotate: boolean = false;
  private canViewAllMatches: boolean = false; //TODO flesh out

  constructor(private authService: AuthorizationService, private db: DatabaseService, private router: Router, private cdr: ChangeDetectorRef, public afAuth: AngularFireAuth, private trackerService: TrackerService){
    super();
  }

  ngOnInit() {
    let self = this;
    this.authService.currentUserObservable.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
      self.afAuth.authState.pipe(takeUntil(this.ngUnsubscribe)).subscribe(authState =>{
        // console.log("result of currentUserObservable in app.component: ");
        // console.log(result);
        // console.log("authState in app.component: ");
        // console.log(authState);
        if(result && result.uid && authState){
          // console.log("result in currentUserObservable in app component happens: ");
          // console.log(result);
          this.db.getUserByUid(result.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((dbUser: User) =>{
            // console.log("dbUser in getUserByUid of app.component updated:");
            // console.log(dbUser);
            this.trackerService.currentUserBehaviorSubject.next(dbUser); //this should be the ONLY subscription to currentUserObservable app-wide!
            this.userObjFromDb = dbUser;
          });
        } else{
          this.trackerService.currentUserBehaviorSubject.next(null);
        }
      });
    });

    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((currentUser) =>{
      // console.log("currentUser in trackerService as seen in app.component [check if this has uid and id both; it should]: ");
      // console.log(currentUser);
      // console.log(currentUser.uid);
      if(currentUser){ // && currentUser.uid
        // console.log(currentUser.uid);
        if(currentUser.uid){
          // console.log("currentUserObservable currentUser.uid in ngOnInit in app.component: " + currentUser.uid);
          this.authenticationStatus = true;
          this.db.getUserByUid(currentUser.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(dbUser =>{
            this.user = dbUser;
            this.name = dbUser.name;
            // console.log("db user from getUserByUid in app.component is:");
            // console.log(dbUser);
            this.shouldAnnotate = dbUser.paymentStatus;
            this.db.isAdmin(dbUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
              // console.log("isAdmin? " + status);
              // console.log(typeof(status));
              if(status === true){
                // console.log("setting isAdmin to true");
                this.isAdmin = status;
              }
            });
            this.db.hasUserPaid(dbUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(paymentStatus =>{
              // console.log("hasUserPaid? " + paymentStatus);
              // console.log(typeof(paymentStatus));
              if(paymentStatus === true){
                // console.log("setting paidStatus to true...");
                this.paidStatus = paymentStatus;
              }else{
                this.paidStatus = false;
              }
            });
            this.db.getUserReputationPoints(dbUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(reputation =>{
              this.db.updatePrivileges(dbUser, Number(reputation));
            });
          })
        } else {
          this.authenticationStatus = false;
          this.user = null; //shouldn't be necessary becuase authenticationStatus is doing this job right now, but here ya go anyway
        }
      } else{
        this.authenticationStatus = false;
        this.name = "Anonymous User";
      }
    });
  }

  loginGoogleComponent(){
    this.authService.googleLogin();
  }

  logout(){
    let confirmation = confirm("Are you sure you want to log out?");
    if (confirmation == true) {
      this.authService.signOut();
      this.trackerService.currentUserBehaviorSubject.next(null); //TODO necessary?
      // location.reload();
    } else {
    }
  };

  navigateToVideoInNeedOfAnnotation(){
    this.db.getMatchInNeedOfAnnotation().pipe(take(1)).subscribe(match =>{
      this.router.navigate(['matches/' + match.id]);
    });
  }

}
