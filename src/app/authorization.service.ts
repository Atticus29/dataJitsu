import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { User } from './user.model';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class AuthorizationService {
  public authenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private locationWatcher = new EventEmitter();  // @TODO: switch to RxJS Subject instead of EventEmitter
  user: Observable<firebase.User>;
  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, private router: Router, public dbService: DatabaseService, private _snackBar: MatSnackBar) {
    this.user = afAuth.authState;
    let self = this;
    this.user.subscribe(user=>{
      if(user){
        this.authenticated.next(true);
        this.dbService.getNodeIdFromEmail(user.email).on("child_added", snapshot=>{
          this.dbService.addUidToUser(user.uid, snapshot.key);
        });
      }
    });
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.authenticated.next(true);
    //@TODO handle login errors
    //@TODO handle userCreation when they log in with google (associating the userID with the uuid)
  }

  // isAuthenticated() { //TODO I can't figure out how to get this to work, so I'm just using this.afAuth.authState.subscribe (user) if(user)
  //   return this.authenticated;
  //   //old // return this.afAuth.authState;
  //   //@TODO Not yet clear whether moving this into the now-defunct isAuthenticated method of authorization service would work
  // }

  logout() {
    if(confirm("Are you sure you want to sign out?")){
      this.afAuth.auth.signOut();
      this.authenticated.next(false);
      //@TODO test whether authenticated changes at appropriate times for protected directive to work
      //@TODO navigate to root
      // this.router.navigate(['login']);
    }
  }

  switchUser(){
    this.logout();
    this.loginGoogle();
  }

  getCurrentUser(){
    this.user = this.afAuth.authState; //TODO not sure whether will fix
    return this.user;
    // .catch(()=>of(false));
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  signup(email: string, password: string) {
    this.afAuth
    .auth
    .createUserWithEmailAndPassword(email, password)
    .then(value => {
      // console.log('Success!', value);
      this.authenticated.next(true);
    })
    .catch(err => {
      console.log('Something went wrong:',err.message);
      this.openSnackBar('Something went wrong:' + err.message, null);
      //TODO open snackbar
    });
  }

  setAuthenticated(newStatus: boolean){ //TODO this.authenticated isn't working as expected. Might get rid of this
    this.authenticated.next(newStatus);
  }

  login(email: string, password: string) {
    this.afAuth
    .auth
    .signInWithEmailAndPassword(email, password)
    .then(value => {
      this.authenticated.next(true);
      this.router.navigate(['']);
    })
    .catch(err => {
      console.log('Something went wrong:',err.message);
      this.openSnackBar('Something went wrong:' + err.message + " Please try again later or once you have an internet connection.", null);
    });
  }

  public subscribe(onNext: (value: any) => void, onThrow?: (exception: any) => void, onReturn?: () => void) {
    return this.locationWatcher.subscribe(onNext, onThrow, onReturn);
  }

}
