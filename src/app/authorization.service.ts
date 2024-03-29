import { Injectable, NgZone } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database"; //removed FirebaseListObservable
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { Router } from "@angular/router";
import { get } from "lodash";
// import * as firebase from 'firebase';

import { takeUntil, take, first } from "rxjs/operators";
import { Subject, Observable, BehaviorSubject } from "rxjs";

import { DatabaseService } from "./database.service";
import { User } from "./user.model";
import { constants } from "./constants";

@Injectable({
  providedIn: "root",
})
export class AuthorizationService {
  private authError: BehaviorSubject<any> = new BehaviorSubject(null);
  private authState: any = null;
  public authenticated: boolean = false;
  // private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private afAuth: AngularFireAuth,
    private afdb: AngularFireDatabase,
    private router: Router,
    public ngZone: NgZone,
    private databaseService: DatabaseService
  ) {
    // let localUnsubscribeSubject: Subject<void> = new Subject<void>();
    this.afAuth.authState.subscribe((user) => {
      //.pipe(takeUntil(localUnsubscribeSubject))
      if (user) {
        this.authenticated = true;
        // localUnsubscribeSubject.next();
        // localUnsubscribeSubject.complete();
      } else {
        this.authenticated = false;
      }
    });
    this.authError.subscribe((errorResults) => {
      // .pipe(takeUntil(this.ngUnsubscribe))
      console.log("errorResults from authorization service");
      console.log(errorResults);
    });
  }

  async getUser() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  // Returns true if user is logged in
  // get authenticatedObservable(): any {
  //   let obsRet = Observable.create(function(observer){
  //     this.afAuth.authState.subscribe(result =>{
  //       if(result !== null){
  //         observer.next(true);
  //       } else{
  //         observer.next(false);
  //       }
  //     });
  //   });
  //   return obsRet;
  // }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): Observable<any> {
    const self = this;
    const obsRet = Observable.create(function (observer) {
      self.afAuth.authState.subscribe((authStateObs) => {
        console.log("user in currentUserObservable in authorization service: ");
        console.log(authStateObs);
        observer.next(authStateObs);
      });
    });
    return obsRet;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : "";
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false;
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) {
      return "Guest";
    } else if (this.currentUserAnonymous) {
      return "Anonymous";
    } else {
      return this.authState["displayName"] || "User without a Name";
    }
  }

  //// Social Auth ////

  githubLogin() {
    const provider = new auth.GithubAuthProvider();
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new auth.TwitterAuthProvider();
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.authState = result.user;
          // console.log("result.user in socialSignIn:");
          // console.log(result.user);
          this.router.navigate(["landing"]); // TODO update
          //TODO switch user to the one in the db
          // this.updateUserData()
        });
        // this.updateUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
        // console.log(error);
      });
  }

  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth
      .signInAnonymously()
      .then((user) => {
        this.authState = user;
        // this.updateUserData()
      })
      .catch((error) => console.log(error));
  }

  //// Email/Password Auth ////

  emailSignUp(email: string, password: string) {
    const localUnsubscribeSubject: Subject<void> = new Subject<void>();
    const self = this;
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        if (result) {
          if (result.user) {
            this.authState = result.user;
            this.databaseService
              .getNodeIdFromEmail(result.user.email)
              .pipe(takeUntil(localUnsubscribeSubject))
              .subscribe((nodeId: string) => {
                // console.log("nodeId is " + nodeId);
                if (nodeId) {
                  this.databaseService.setUidFromNodeId(
                    result.user.uid,
                    nodeId
                  );
                  localUnsubscribeSubject.next();
                  localUnsubscribeSubject.complete();
                  // this.databaseService.getUserById(nodeId).pipe().subscribe((user: User) =>{
                  //   console.log("user in getUserById inside getNodeIdFromEmail in emailSignUp in AuthorizationService: ");
                  //   console.log(user);
                  //   if(user){
                  //
                  //   }
                  //   this.databaseService.setUidFromNodeId(result.user.uid,nodeId);
                  // });
                }
              });
            this.sendVerificationEmail();
            // this.updateUserData()
          }
        }
      })
      .catch((error) => {
        window.alert(error.message);
        // console.log(error);
      });
  }

  async sendVerificationEmail() {
    return await this.afAuth.currentUser
      .then((u) => u.sendEmailVerification())
      .then(() => {
        // this.router.navigate(['verify-email-address']); //TODO comment back in
      });
  }

  forgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert("Password reset email sent, check your inbox.");
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  emailLogin(email: string, password: string) {
    // console.log("email in emailLogin in authorization service: " + email);
    // console.log("password in emailLogin in authorization service: " + password);
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("user in emailLogin in authorization service");
        console.log(result);
        this.authState = result; //TODO?
        // const emailAddress = get(result, "email", "");
        // console.log("deleteMe got here emailAddress is: " + emailAddress);
        if (email) {
          this.databaseService
            .getUserByEmailAddress(email)
            .pipe(take(1))
            .subscribe((dbUser) => {
              this.ngZone.run(() => {
                this.router.navigate([
                  constants.userInfoPath + "/" + get(dbUser, "id", ""),
                ]);
              });
            });
        }
        // console.log("navigating to matches...");
        // this.router.navigate([constants.allVideosPathName]);
        // this.router.navigate([constants.userInfoPath]);
        // console.log(this.currentUserId);
        // this.updateUserData()
      })
      .catch((error) => {
        window.alert(error.message);
        // console.log("error code is: ");
        // console.log(error.code);
        //  if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        //      this.authError.next('The username and password you entered did not match our records. Please double-check and try again.');
        //      // try {
        //      //   alert("Log in failed. Attempting Google Login");
        //      //   this.googleLogin();
        //      // }
        //      // catch(error) {
        //      //   console.error(error);
        //      //   // expected output: ReferenceError: nonExistentFunction is not defined
        //      //   // Note - error messages will vary depending on browser
        //      // }
        //  } else if (error.code === 'auth/user-disabled') {
        //      this.authError.next('Your account has been suspended. Please contact us directly to discuss this.');
        //  } else {
        //    this.authError.next(error.message);
        //  }
      });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    return auth()
      .sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((error) => console.log(error));
  }

  //// Sign Out ////
  signOut(): void {
    const localUnsubscribeSubject: Subject<void> = new Subject<void>();
    this.afAuth.signOut();
    this.currentUserObservable
      .pipe(takeUntil(localUnsubscribeSubject))
      .subscribe((currentUsr) => {
        // console.log("currentUsr in signOut in authorization service: ");
        // console.log(currentUsr);
        if (!currentUsr) {
          localUnsubscribeSubject.next();
          localUnsubscribeSubject.complete();
          this.ngZone.run(() => {
            this.router.navigate(["login"]);
          });
        }
      });
  }
  //// Helpers ////

  // private updateUserData(user: any): void {
  //   SetUserData(user) {
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
  //   const userData: User = {
  //     uid: user.uid,
  //     email: user.email,
  //     displayName: user.displayName,
  //     photoURL: user.photoURL,
  //     emailVerified: user.emailVerified
  //   }
  //   return userRef.set(userData, {
  //     merge: true
  //   })
  // }
  // this.authState.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
  // let path = `users/${user.id}`; // Endpoint on firebase
  // let data = {
  //               email: user.email,
  //               name: user.displayName ? user.displayName : "Nameless User",
  //               uid: user.uid,
  //               photoURL: user.photoURL,
  //               emailVerified: user.emailVerified
  //             }
  // this.databaseService.object(path).update(data)
  // .catch(error => console.log(error));
  // });
  // Writes user name and email to realtime db
  // useful if your app displays information about users or for admin features
  // let path = `users/${this.currentUserId}`; // Endpoint on firebase
  // let data = {
  //               email: this.authState.email,
  //               name: this.authState.displayName ? this.authState.displayName : "Nameless User"
  //             }
  // this.db.object(path).update(data)
  // .catch(error => console.log(error));
  // }
}
