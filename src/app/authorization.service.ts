import { Injectable, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database'; //removed FirebaseListObservable
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from "@angular/router";
import * as firebase from 'firebase';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Injectable()
export class AuthorizationService {

  @Output() authState: EventEmitter<any> = new EventEmitter();
  @Output() authError: EventEmitter<any> = new EventEmitter();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private router:Router) {
              this.afAuth.authState.subscribe((auth) => {
              this.authState.emit(auth);
            });
          }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Returns current user data
  get currentUser(): any {
    return this.authenticated ? this.authState : null;
  }

  // Returns
  get currentUserObservable(): any {
    return this.afAuth.authState
  }

  // Returns current user UID
  //TODO fix this with Observable magic?
  // get currentUserId(): string {
  //   return this.authenticated ? this.authState.uid : '';
  // }

  // Anonymous User
  //TODO fix this with Observable magic?
  // get currentUserAnonymous(): boolean {
  //   return this.authenticated ? this.authState.isAnonymous : false
  // }

  // Returns current user display name or Guest
  //TODO fix this with Observable magic?
  // get currentUserDisplayName(): string {
  //   if (!this.authState) { return 'Guest' }
  //   else if (this.currentUserAnonymous) { return 'Anonymous' }
  //   else { return this.authState['displayName'] || 'User without a Name' }
  // }

  //// Social Auth ////

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin(){
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) =>  {
          this.authState.emit(credential.user);
          this.updateUserData()
      })
      .catch(error => console.log(error));
  }


  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
    .then((user) => {
      this.authState.emit(user);
      this.updateUserData()
    })
    .catch(error => console.log(error));
  }

  //// Email/Password Auth ////

  emailSignUp(email:string, password:string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState.emit(user);
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  emailLogin(email:string, password:string) {
    // console.log("email in emailLogin in authorization service: " + email);
    // console.log("password in emailLogin in authorization service: " + password);
     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((user) => {
         // console.log("user in emailLogin in authorization service");
         // console.log(user);
         this.authState.emit(user);
         // console.log(this.currentUserId);
         this.updateUserData()
       })
       .catch(error => {
          if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
              this.authError.emit('The username and password you entered did not match our records. Please double-check and try again.');
          } else if (error.code === 'auth/user-disabled') {
              this.authError.emit('Your account has been suspended. Please contact us directly to discuss this.');
          } else {
            this.authError.emit(error.message);
          }
      });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((error) => console.log(error))
  }


  //// Sign Out ////
  signOut(): void {
    this.afAuth.auth.signOut();
    this.router.navigate(['login']);
  }
  //// Helpers ////

  private updateUserData(): void {
    this.authState.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
      let path = `users/${usr.id}`; // Endpoint on firebase
      let data = {
                    email: usr.email,
                    name: usr.displayName ? usr.displayName : "Nameless User"
                  }
      this.db.object(path).update(data)
      .catch(error => console.log(error));
    });
  // Writes user name and email to realtime db
  // useful if your app displays information about users or for admin features
    // let path = `users/${this.currentUserId}`; // Endpoint on firebase
    // let data = {
    //               email: this.authState.email,
    //               name: this.authState.displayName ? this.authState.displayName : "Nameless User"
    //             }
    // this.db.object(path).update(data)
    // .catch(error => console.log(error));
  }
}
