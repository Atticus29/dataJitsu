import { Injectable, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { User } from './user.model';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';

@Injectable()
export class AuthorizationService {
  private authenticated: Observable<boolean>;
  private locationWatcher = new EventEmitter();  // @TODO: switch to RxJS Subject instead of EventEmitter
  user: Observable<firebase.User>;
  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase, private router: Router, public dbService: DatabaseService) {
    this.user = afAuth.authState;
    this.user.subscribe(user=>{
      if(user){
        this.authenticated = of(true);
        this.dbService.getNodeIdFromEmail(user.email).on("child_added", snapshot=>{
          this.dbService.addUidToUser(user.uid, snapshot.key);
        });
      }
    });
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.authenticated = of(true);
    //@TODO handle login errors
    //@TODO handle userCreation when they log in with google (associating the userID with the uuid)
  }

  isAuthenticated() {
    return this.afAuth.authState;
    //@TODO Not yet clear whether moving this into the now-defunct isAuthenticated method of authorization service would work
  }

  logout() {
    if(confirm("Are you sure you want to sign out?")){
      this.afAuth.auth.signOut();
      this.authenticated = of(false);
      //@TODO test whether authenticated changes at appropriate times for protected directive to work
      //@TODO navigate to root
      this.router.navigate(['']);
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

  signup(email: string, password: string) {
    this.afAuth
    .auth
    .createUserWithEmailAndPassword(email, password)
    .then(value => {
      // console.log('Success!', value);
      this.authenticated = of(true);
    })
    .catch(err => {
      console.log('Something went wrong:',err.message);
    });
  }

  setAuthenticated(newStatus: boolean){
    this.authenticated = of(newStatus);
  }

  login(email: string, password: string) {
    this.afAuth
    .auth
    .signInWithEmailAndPassword(email, password)
    .then(value => {
      this.authenticated = of(true);
      this.router.navigate(['']);
    })
    .catch(err => {
      console.log('Something went wrong:',err.message);
    });
  }

  public subscribe(onNext: (value: any) => void, onThrow?: (exception: any) => void, onReturn?: () => void) {
    return this.locationWatcher.subscribe(onNext, onThrow, onReturn);
  }

}
