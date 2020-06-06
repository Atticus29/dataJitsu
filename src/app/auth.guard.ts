import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrackerService } from './tracker.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private trackerService: TrackerService, private router: Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let loginStatusObservable = this.checkLogin();
    loginStatusObservable.subscribe(loginStatus =>{ //.pipe(takeUntil(this.ngUnsubscribe))
      console.log("loginStatus is ");
      console.log(loginStatus);
    });
    return loginStatusObservable;
  }

  checkLogin(): Observable<boolean>{
    let self = this;
    let obsRet = Observable.create(function(observer){
      self.trackerService.currentUserBehaviorSubject.subscribe(usr =>{ //.pipe(takeUntil(this.ngUnsubscribe))
        if(usr){
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
