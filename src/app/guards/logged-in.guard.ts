import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AuthorizationService } from '../authorization.service';

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
          observer.next(false);
          self.router.navigate(['/matches']);
        }else{
          // console.log("User not logged in!");
          observer.next(true);
          // self.router.navigate(['/login']);
        }
      });
    });
    return obsRet;
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): boolean|UrlTree {
  //     console.log("canActivate in logged-in guard executed");
  //     // let url: string = state.url;
  //     // return this.shouldSeeLoginPage(url);
  //     if (this.authService.authenticated) {
  //         this.router.navigate(['/matches']);
  //         return false;
  //     } else {
  //         return true;
  //     }
  // }

  // shouldSeeLoginPage(url: string): boolean|UrlTree{
  //   console.log("shouldSeeLoginPage entered");
  //   if(!this.authService.authenticated){
  //     console.log("a");
  //     return true;
  //   }else{
  //     console.log("b");
  //     console.log(url);
  //     // this.router.navigate(['/']);
  //     return false;
  //   }
  //   // this.authService.redirectUrl = url;
  //   // return this.router.parseUrl('/login');
  //
  //   // let self = this;
  //   // let obsRet = Observable.create(function(observer){
  //   //   combineLatest(self.authService.currentUserObservable, self.afAuth.authState).pipe(takeUntil(self.ngUnsubscribe)).subscribe(results =>{
  //   //     let result = results[0];
  //   //     let authState = results[1];
  //   //     console.log("result is: ");
  //   //     console.log(result);
  //   //     console.log("authState is: ");
  //   //     console.log(authState);
  //   //     if(result && result.uid && authState){
  //   //       console.log("logged-in guard taking you to main");
  //   //       self.router.navigate(['/']);
  //   //       observer.next(false);
  //   //     }else{
  //   //       console.log("logged-in guard taking you to login");
  //   //       self.router.navigate(['/login']);
  //   //       observer.next(true);
  //   //     }
  //   //   });
  //   // });
  //   // return obsRet;
  // }


}
