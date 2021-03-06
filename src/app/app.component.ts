import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ChangeDetectorRef } from '@angular/core';
// import { MzNavbarModule } from 'ngx-materialize'

import { takeUntil, take, first } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { NgxFeedbackService, FeedbackData } from 'ngx-feedback';

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
export class AppComponent extends BaseComponent implements OnInit, OnDestroy {
  // private ngUnsubscribe: Subject<void> = new Subject<void>();
  // private constants: Object = constants;
  private paidStatus: boolean = false;
  private isAdmin: boolean = false;
  user: any = null;
  private name: string = "Anonymous User";
  userObjFromDb: Object = {id:null};
  title: string = constants.title;
  authenticationStatus: boolean =false;
  shouldAnnotate: boolean = false;
  private canViewAllMatches: boolean = false; //TODO flesh out
  private localReputation: number = null;
  private localNewReputationCount: number = 0;

  constructor(private authService: AuthorizationService, private dbService: DatabaseService, private router: Router, private cdr: ChangeDetectorRef, public afAuth: AngularFireAuth, private trackerService: TrackerService, public ngZone: NgZone, private readonly feedbackService: NgxFeedbackService){
    super();
  }

  async ngOnInit() {
    // console.log("ngOnInit entered");
    let self = this;
    this.feedbackService.listenForFeedbacks().subscribe(async(data: FeedbackData) => {
      // console.log("listenForFeedbacks called");
      let tmpUsr = await this.trackerService.currentUserBehaviorSubject.pipe(first()).toPromise();
      if(tmpUsr){
        // console.log("user in listenForFeedbacks: ");
        // console.log(tmpUsr);
        this.dbService.addFeedbackToDatabase(data, tmpUsr.id);
      }
    });

    combineLatest(this.authService.currentUserObservable, this.afAuth.authState).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      // console.log("results entered in combineLatest call");
      // console.log(results);
      let result = results[0];
      let authState = results[1];
      if(result && result.uid && authState){
        this.dbService.getUserByUid(result.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((dbUser: any) =>{
          // console.log("dbUser is: ");
          // console.log(dbUser.privileges);
          if(dbUser && dbUser.id){
            if(dbUser.privileges.canViewAllMatches){
              this.canViewAllMatches = dbUser.privileges.canViewAllMatches;
            }else{
              // console.log("got here instead 2");
            }
            this.dbService.getUserReputationPoints(dbUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(repPoints =>{
              this.localReputation = Number(repPoints); //TODO this is the only part that is not in base component...experiment with putting it in there
            });
            this.trackerService.currentUserBehaviorSubject.next(dbUser); //this should be the ONLY emission to currentUserObservable app-wide!
            // console.log("dbUser entered! Got: ");
            // console.log(dbUser);
            this.userObjFromDb = dbUser;
          }
        });
      } else{
        this.trackerService.currentUserBehaviorSubject.next(null);
      }
    });

    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((currentUser) =>{
      // console.log("currentUser in trackerService as seen in app.component [check if this has uid and id both; it should]: ");
      if(currentUser){
        // console.log(currentUser);
        if(currentUser.uid){
          // console.log("currentUserObservable currentUser.uid in ngOnInit in app.component: " + currentUser.uid);
          // console.log("changing authenticationStatus to true...");
          this.authenticationStatus = true;
          this.dbService.getUserByUid(currentUser.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(dbUser =>{
            this.user = dbUser;
            this.name = dbUser.name;
            // console.log("db user from getUserByUid in app.component is:");
            // console.log(dbUser);
            this.shouldAnnotate = dbUser.paymentStatus;
            this.dbService.isAdmin(dbUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
              // console.log("isAdmin? " + status);
              // console.log(typeof(status));
              if(status === true){
                // console.log("setting isAdmin to true");
                this.isAdmin = status;
              }
            });
            this.dbService.getUserReputationPoints(dbUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(reputation =>{
              this.dbService.updatePrivileges(dbUser, Number(reputation));
            });
          })
        } else {
          // console.log("currentUser id DNE; changing authenticationStatus to false ....")
          this.authenticationStatus = false;
          this.user = null; //shouldn't be necessary becuase authenticationStatus is doing this job right now, but here ya go anyway
        }
      } else{
        // console.log("currentUser DNE; changing authenticationStatus to false ....")
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
    this.dbService.getMatchInNeedOfAnnotation().pipe(take(1)).subscribe(match =>{
      if(match && match.id){
        this.ngZone.run(() =>{
          console.log("navigating to match: " + match.id);
          this.router.navigate([constants.individualPathName + "/" + match.id]);
        });
      }
    });
  }

  ngOnDestroy(){
    console.log("ngOnDestroy entered");
  }

}
