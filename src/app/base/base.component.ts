import { Component, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs'; //combineLatest
// import { takeUntil, take, last } from 'rxjs/operators';
// import { AngularFireAuth } from '@angular/fire/auth';
//
// import { User } from './user.model';
// import { AuthorizationService } from '../authorization.service';
// import { DatabaseService } from '../database.service';
// import { TrackerService } from '../tracker.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnDestroy {
  ngUnsubscribe = new Subject<void>();
  userObjFromDb: any = null;

  constructor() { } //private authService: AuthorizationService, private dbService: DatabaseService, private trackerService: TrackerService, public afAuth: AngularFireAuth

  ngOnInit() { //TODO implement this
    // combineLatest(this.authService.currentUserObservable, this.afAuth.authState).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
    //   let result = results[0];
    //   let authState = results[1];
    //   if(result && result.uid && authState){
    //     this.dbService.getUserByUid(result.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe((dbUser: User) =>{
    //       console.log("dbUser from base component subscription:");
    //       console.log(dbUser);
    //       this.trackerService.currentUserBehaviorSubject.next(dbUser); //this should be the ONLY emission to currentUserObservable app-wide!
    //       this.userObjFromDb = dbUser;
    //     });
    //   } else{
    //     this.trackerService.currentUserBehaviorSubject.next(null);
    //   }
    // });
  }

  ngOnDestroy(){
    // this.ngUnsubscribe.subscribe(result =>{
    //   console.log("got into ngOnDestroy:");
    //   console.log(result); //result is undefined
    // });
    if(this.ngUnsubscribe){
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    } else{
      console.log("ngUnsubscribe was null");
    }
  }

}
