import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders }  from '@angular/core';
import { YoutubeComponent } from './youtube/youtube.component';
import { NewVideoComponent } from './new-video/new-video.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { TestDbComponent } from './test-db/test-db.component';
import { LandingComponent } from './landing/landing.component';
import { VideoDisplayComponent } from './video-display/video-display.component';
import { LoginComponent } from './login/login.component';
import { AllVideosComponent } from './all-videos/all-videos.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AnnotationDisplayComponent } from './annotation-display/annotation-display.component';
import { TemporaryComponent } from './temporary/temporary.component';
import { VerifyEmailAddressComponent } from './verify-email-address/verify-email-address.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminComponent } from './admin/admin.component';
import { LogoutComponent } from './logout/logout.component';
import { NewsComponent } from './news/news.component';
import { FaqComponent } from './faq/faq.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'; //AngularFireAuthGuard, hasCustomClaim,
import { canActivate, AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AuthGuard } from './auth.guard';

// const adminOnly = hasCustomClaim('admin');
// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
// const redirectLoggedInToAllMatches = () => redirectLoggedInTo(['matches']);


const routes: Routes = [
  {
    path: '',
    component: AllVideosComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'login',
    children: [],
    component: LoginComponent, //TODO make redirect if logged in
    // canActivate: [],
    // data: { authGuardPipe: redirectLoggedInToAllMatches} //,
    // pathMatch: 'full'
  }
  ,
  {
    path: 'newmatch',
    component: NewVideoComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'user/:userId',
    component: UserInfoComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'faq',
    component: FaqComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'createaccount',
    component: CreateAccountComponent,
    pathMatch: 'full'
  },{
    path: 'populatedb',
    component: TestDbComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'logout',
    component: LogoutComponent, //don't redirectUnauthorizedTo with this one. Handled manually. You have already tried this
    pathMatch: 'full'
  },{
    path: 'landing',
    component: LandingComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'matches',
    component: AllVideosComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard], //TODO add admin guard
    pathMatch: 'full'
  },{
    path: 'matches/:videoId',
    component: VideoDisplayComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'news',
    component: NewsComponent,
    pathMatch: 'full'
  },{
    path: 'youtube',
    component: YoutubeComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'matches/:videoId/annotate',
    component: AnnotationDisplayComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'mark',
    component: TemporaryComponent,
    pathMatch: 'full'
  },{
    path: 'landing',
    component: LandingComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'verify-email-address',
    component: VerifyEmailAddressComponent,
  },{
    path: 'payment',
    component: PaymentComponent,
    canActivate: [AuthGuard],
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
