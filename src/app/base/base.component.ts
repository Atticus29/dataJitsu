import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgZone } from "@angular/core";
import { Subject } from "rxjs"; //combineLatest
import { Router } from "@angular/router";
import { constants } from "../constants";
// import { takeUntil, take, last } from 'rxjs/operators';
// import { AngularFireAuth } from '@angular/fire/auth';
//
// import { User } from './user.model';
// import { AuthorizationService } from '../authorization.service';
// import { DatabaseService } from '../database.service';
// import { TrackerService } from '../tracker.service';
import { FormProcessingService } from "../form-processing.service";

@Component({
  selector: "app-base",
  templateUrl: "./base.component.html",
  styleUrls: ["./base.component.scss"],
})
export class BaseComponent implements OnDestroy, OnInit {
  public constants: any = constants;
  ngUnsubscribe = new Subject<void>();
  userObjFromDb: any = null;

  constructor() {} //you can't access any of these services from here, so don't try it again lol //public formProcessingService: FormProcessingService

  ngOnInit() {
    //TODO implement this
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

  ngOnDestroy() {
    console.log("ngOnDestroy in BaseComponent reached");
    // this.ngUnsubscribe.subscribe(result =>{
    //   console.log("got into ngOnDestroy:");
    //   console.log(result); //result is undefined
    // });
    if (this.ngUnsubscribe) {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    } else {
      console.log("ngUnsubscribe was null");
    }
  }
}
