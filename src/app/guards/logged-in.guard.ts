import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthorizationService } from '../authorization.service';
import { constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  ngUnsubscribe = new Subject<void>();
  constructor(private authService: AuthorizationService, private router: Router, public afAuth: AngularFireAuth){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loginStatusObservable = this.checkLogin();
    loginStatusObservable.subscribe(loginStatus =>{ //.pipe(takeUntil(this.ngUnsubscribe))
      // console.log("loginStatus in logged-in guard is ");
      // console.log(loginStatus);
    });
    return loginStatusObservable;
  }

  checkLogin(): Observable<boolean>{
    let self = this;
    let obsRet = Observable.create(function(observer){
      combineLatest(self.authService.currentUserObservable, self.afAuth.authState).pipe(takeUntil(self.ngUnsubscribe)).subscribe(results =>{
        let result = results[0];
        let authState = results[1];
        // console.log("result in checkLogin of auth.guard is: ");
        // console.log(result);
        // console.log("authState is: ");
        // console.log(authState);
        if(result && result.uid && authState){
          console.log("babie, you logged in according to logged-in guard");
          observer.next(false);
          self.router.navigate([constants.allVideosPathName]);
        }else{
          observer.next(true);
        }
      });
    });
    return obsRet;
  }

  }
