import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthorizationService } from './authorization.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Injectable()
export class ProtectionGuard implements CanActivate {
  returnVal: boolean = false;
  constructor(private as: AuthorizationService, public afAuth: AngularFireAuth, private router: Router){}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.afAuth.authState.pipe(map((auth) => {
        if (!auth) {
          this.router.navigateByUrl('login');
          return false;
        }
        return true;
    }));
  }
}
