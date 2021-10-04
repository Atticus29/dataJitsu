import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { ChangeDetectorRef } from "@angular/core";
// import { MzNavbarModule } from 'ngx-materialize'

import { takeUntil, take, first } from "rxjs/operators";
import { Subject, combineLatest } from "rxjs";
import { NgxFeedbackService, FeedbackData } from "ngx-feedback";

import { constants } from "./constants";
import { ProtectionGuard } from "./protection.guard";
import { AuthorizationService } from "./authorization.service";
import { DatabaseService } from "./database.service";
import { TrackerService } from "./tracker.service";
import { User } from "./user.model";
import { BaseComponent } from "./base/base.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  // providers: [AuthorizationService, ProtectionGuard],
})
export class AppComponent extends BaseComponent implements OnInit, OnDestroy {
  // private ngUnsubscribe: Subject<void> = new Subject<void>();
  // private constants: Object = constants;
  private paidStatus: boolean = false;
  private isAdmin: boolean = false;
  user: any = null;
  private name: string = "Anonymous User";
  userObjFromDb: Object = { id: null };
  title: string = constants.title;
  authenticationStatus: boolean = false;
  shouldAnnotate: boolean = false;
  private canViewAllMatches: boolean = false; //TODO flesh out
  private localReputation: number = null;
  private localNewReputationCount: number = 0;

  constructor(
    private authService: AuthorizationService,
    private databaseService: DatabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public afAuth: AngularFireAuth,
    private trackerService: TrackerService,
    public ngZone: NgZone,
    private readonly feedbackService: NgxFeedbackService
  ) {
    super();
  }

  async ngOnInit() {
    // console.log("ngOnInit entered");
    const self = this;
    this.feedbackService
      .listenForFeedbacks()
      .subscribe(async (data: FeedbackData) => {
        // console.log("listenForFeedbacks called");
        const tmpUsr = await this.trackerService.currentUserBehaviorSubject
          .pipe(first())
          .toPromise();
        if (tmpUsr) {
          // console.log("user in listenForFeedbacks: ");
          // console.log(tmpUsr);
          this.databaseService.addFeedbackToDatabase(data, tmpUsr.id);
        }
      });

    combineLatest([
      this.trackerService.currentUserDbId,
      this.trackerService.currentUserUid,
    ])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((results) => {
        const dbId = results[0];
        const uid = results[1];
        if (dbId && uid) this.databaseService.addUidToUser(uid, dbId);
      });

    combineLatest([
      this.authService.currentUserObservable,
      this.afAuth.authState,
    ])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((results) => {
        const result = results[0];
        const authState = results[1];
        if (result && result.uid && authState) {
          this.trackerService.currentUserUid.next(result.uid);
          this.databaseService
            .getUserByUid(result.uid)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((dbUser: any) => {
              if (dbUser && dbUser.id && dbUser.privileges) {
                if (dbUser.privileges.canViewAllMatches) {
                  this.canViewAllMatches = dbUser.privileges.canViewAllMatches;
                } else {
                  // TODO
                }
                this.databaseService
                  .getUserReputationPoints(dbUser.id)
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe((repPoints) => {
                    this.localReputation = Number(repPoints); //TODO this is the only part that is not in base component...experiment with putting it in there
                  });
                this.trackerService.currentUserBehaviorSubject.next(dbUser); //this should be the ONLY emission to currentUserObservable app-wide!
                this.userObjFromDb = dbUser;
              } else {
                // TODO case where we have a non-null authState and a non-null uid, but there is no user in the database with that uid yet should not be possible
                console.log("Something weird has happened. Alert staff.");
              }
            });
        } else {
          this.trackerService.currentUserBehaviorSubject.next(null);
        }
      });

    this.trackerService.currentUserBehaviorSubject
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currentUser) => {
        console.log(
          "currentUser in trackerService as seen in app.component [check if this has uid and id both; it should]: "
        );
        console.log(currentUser);
        if (currentUser) {
          // console.log(currentUser);
          if (currentUser.uid) {
            // console.log("currentUserObservable currentUser.uid in ngOnInit in app.component: " + currentUser.uid);
            // console.log("changing authenticationStatus to true...");
            this.authenticationStatus = true;
            this.databaseService
              .getUserByUid(currentUser.uid)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((dbUser) => {
                this.user = dbUser;
                this.name = dbUser.name;
                this.shouldAnnotate = dbUser.paymentStatus;
                this.databaseService
                  .isAdmin(dbUser.id)
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe((status) => {
                    // console.log("isAdmin? " + status);
                    // console.log(typeof(status));
                    if (status === true) {
                      // console.log("setting isAdmin to true");
                      this.isAdmin = status;
                    }
                  });
                this.databaseService
                  .getUserReputationPoints(dbUser.id)
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe((reputation) => {
                    this.databaseService.updatePrivileges(
                      dbUser,
                      Number(reputation)
                    );
                  });
              });
          } else {
            // console.log("currentUser id DNE; changing authenticationStatus to false ....")
            this.authenticationStatus = false;
            this.user = null; //shouldn't be necessary becuase authenticationStatus is doing this job right now, but here ya go anyway
          }
        } else {
          // console.log("currentUser DNE; changing authenticationStatus to false ....")
          this.authenticationStatus = false;
          this.name = "Anonymous User";

          console.log("user doesn't exist now. Should move along...");
          // this.router.navigate(["login"]);
        }
      });
  }

  loginGoogleComponent() {
    this.authService.googleLogin();
  }

  logout() {
    let confirmation = confirm("Are you sure you want to log out?");
    if (confirmation == true) {
      this.authService.signOut();
      this.trackerService.currentUserBehaviorSubject.next(null); //TODO necessary?
      // location.reload();
    } else {
    }
  }

  navigateToVideoInNeedOfAnnotation() {
    this.databaseService
      .getMatchInNeedOfAnnotation()
      .pipe(take(1))
      .subscribe((match) => {
        if (match && match.id) {
          this.ngZone.run(() => {
            console.log("navigating to match: " + match.id);
            this.router.navigate([
              constants.individualPathName + "/" + match.id,
            ]);
          });
        }
      });
  }

  ngOnDestroy() {
    console.log("ngOnDestroy entered");
  }
}
