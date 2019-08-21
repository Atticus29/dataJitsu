import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YoutubeComponent } from './youtube/youtube.component';
import { NewMatchComponent } from './new-match/new-match.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { TestDbComponent } from './test-db/test-db.component';
import { LandingComponent } from './landing/landing.component';
import { MatchDisplayComponent } from './match-display/match-display.component';
import { LoginComponent } from './login/login.component';
import { AllMatchesComponent } from './all-matches/all-matches.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AnnotationDisplayComponent } from './annotation-display/annotation-display.component';
import { TemporaryComponent } from './temporary/temporary.component';
import { VerifyEmailAddressComponent } from './verify-email-address/verify-email-address.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminComponent } from './admin/admin.component';
import { LogoutComponent } from './logout/logout.component';
import { redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'; //AngularFireAuthGuard, hasCustomClaim,
import { canActivate } from '@angular/fire/auth-guard';

// const adminOnly = hasCustomClaim('admin');
// const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);
// const redirectLoggedInToAllMatches = redirectLoggedInTo(['matches']);
const appRoutes: Routes = [
  {
    path: '',
    component: AllMatchesComponent,
    ...canActivate(redirectUnauthorizedTo(['login'])),
    pathMatch: 'full'
  },{
  path: 'login',
  component: LoginComponent,
  ...canActivate(redirectLoggedInTo(['matches'])),
  pathMatch: 'full'
},{
  path: 'newmatch',
  component: NewMatchComponent,
  ...canActivate(redirectUnauthorizedTo(['login'])),
  pathMatch: 'full'
},{
  path: 'createaccount',
  component: CreateAccountComponent,
  ...canActivate(redirectLoggedInTo(['landing'])),
  pathMatch: 'full'
},{
  path: 'populatedb',
  component: TestDbComponent,
  ...canActivate(redirectUnauthorizedTo(['login'])),
  pathMatch: 'full'
},{
  path: 'logout',
  component: LogoutComponent,
  pathMatch: 'full'
},{
  path: 'landing',
  component: LandingComponent,
  ...canActivate(redirectUnauthorizedTo(['login'])),
  pathMatch: 'full'
},{
  path: 'matches',
  component: AllMatchesComponent,
  ...canActivate(redirectUnauthorizedTo(['login'])),
  pathMatch: 'full'
},{
  path: 'admin',
  component: AdminComponent,
  ...canActivate(redirectUnauthorizedTo(['login'])), //TODO add admin guard
  pathMatch: 'full'
},{
  path: 'matches/:matchId',
  component: MatchDisplayComponent,
  ...canActivate(redirectUnauthorizedTo(['login'])),
  pathMatch: 'full'
},{
  path: 'youtube',
  component: YoutubeComponent,
  ...canActivate(redirectUnauthorizedTo(['login'])),
  pathMatch: 'full'
},{
  path: 'matches/:matchId/annotate',
  component: AnnotationDisplayComponent,
  ...canActivate(redirectUnauthorizedTo(['login'])),
  pathMatch: 'full'
},{
  path: 'mark',
  component: TemporaryComponent,
  pathMatch: 'full'
},{
  path: 'landing',
  component: LandingComponent,
  ...canActivate(redirectUnauthorizedTo(['login'])),
  pathMatch: 'full'
},{
  path: 'verify-email-address',
  component: VerifyEmailAddressComponent,
},{
  path: 'payment',
  component: PaymentComponent,
  ...canActivate(redirectUnauthorizedTo(['login'])),
  pathMatch: 'full'
},{
  path: 'error',
  component: NotfoundComponent,
  pathMatch: 'full'
},{
  path: '**',
  component: NotfoundComponent,
  pathMatch: 'full'
}
 ];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
