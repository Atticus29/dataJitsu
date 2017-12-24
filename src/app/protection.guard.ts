import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthorizationService } from './authorization.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Injectable()
export class ProtectionGuard implements CanActivate {
  returnVal: boolean = false;
  constructor(private as: AuthorizationService, public afAuth: AngularFireAuth, private router: Router){}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
    console.log(this.as);
    // return Observable.of(this.afAuth.authState.subscribe(user => {
    //   Observable.of(Boolean(user));
    // }));
    // console.log(typeof this.as.isAuthenticated());
    // this.as.isAuthenticated().subscribe(result =>{
    //   console.log(result);
    // });
    this.as.isAuthenticated().subscribe(result =>{
      console.log(result);
    });
    return this.as.isAuthenticated();
    // return Observable.of(true);
  }
}
