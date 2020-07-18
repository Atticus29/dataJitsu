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
    return !loginStatusObservable;
  }

  checkLogin(): Observable<boolean>{
    let self = this;
    let obsRet = Observable.create(function(observer){
      combineLatest(self.authService.currentUserObservable, self.afAuth.authState).pipe(takeUntil(self.ngUnsubscribe)).subscribe(results =>{
        let result = results[0];
        let authState = results[1];
        if(result && result.uid && authState){
          self.router.navigate(['/']);
          observer.next(true);
        }else{
          self.router.navigate(['/login']);
          observer.next(false);
        }
      });
    });
    return obsRet;
  }


}
