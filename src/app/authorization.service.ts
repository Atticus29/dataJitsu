import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { User } from './user.model';

@Injectable()
export class AuthorizationService {
  user: Observable<firebase.User>;
  constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase) {
    this.user = afAuth.authState;
    this.user.subscribe(user=>{
      if(user){
        var ref = firebase.database().ref('/users');
        ref.once('value', (snapshot)=>{
          if(!snapshot.hasChild(user.uid)){
            let newUser = new User(snapshot.child('name').val(), snapshot.child('email').val(), snapshot.child('password').val(), snapshot.child('giRank').val(), snapshot.child('noGiRank').val(), snapshot.child('affiliation').val(), snapshot.child('age').val(), snapshot.child('weight').val(), snapshot.child('reputationPoints').val(), snapshot.child('dateLastAnnotated').val(), snapshot.child('paidStatus').val(), snapshot.child('gender').val(), snapshot.child('dateCreated').val());
            ref.child(user.uid).set(newUser);
            //TODO this does not work right now
          }
        })
      }
    });
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    //TODO handle login errors
    //TODO handle userCreation when they log in with google (associating the userID with the uuid)
  }

  logout() {
    if(confirm("Are you sure you want to sign out?")){
      this.afAuth.auth.signOut();
    }
  }

  switchUser(){
    this.logout();
    this.loginGoogle();
  }

  getCurrentUser(){
    return this.user;
  }

  signup(email: string, password: string) {
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

  login(email: string, password: string) {
    this.afAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });
  }

}
