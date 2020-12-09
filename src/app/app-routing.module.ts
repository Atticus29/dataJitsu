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
import { CollectionDisplayComponent } from './collection-display/collection-display.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { AnnotationDisplayComponent } from './annotation-display/annotation-display.component';
import { TemporaryComponent } from './temporary/temporary.component';
import { VerifyEmailAddressComponent } from './verify-email-address/verify-email-address.component';
import { CollectionCreationFormComponent } from './collection-creation-form/collection-creation-form.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminComponent } from './admin/admin.component';
import { LogoutComponent } from './logout/logout.component';
import { NewsComponent } from './news/news.component';
import { FaqComponent } from './faq/faq.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { GenericNewVideoFormComponent } from './generic-new-video-form/generic-new-video-form.component';
import { redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'; //AngularFireAuthGuard, hasCustomClaim,
import { canActivate, AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AuthGuard } from './guards/auth.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { constants } from './constants';

// const adminOnly = hasCustomClaim('admin');
// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
// const redirectLoggedInToAllMatches = () => redirectLoggedInTo([constants.allVideosPathName]);


const routes: Routes = [
  {
    path: '',
    component: AllVideosComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedInGuard],
    pathMatch: 'full'
  }
  ,
  {
    path: 'newvideo',
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
    path: constants.allVideosPathName,
    component: AllVideosComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard], //TODO add admin guard
    pathMatch: 'full'
  },{
    path: constants.individualPathName + '/:videoId',
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
    path: constants.allVideosPathName + '/:videoId/annotate',
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
    path: constants.collectionCreationPathName,
    component: CollectionCreationFormComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: constants.collectionsPathName + '/:collectionId',
    component: CollectionDisplayComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: constants.collectionsPathName + '/:collectionId/'+ constants.newVideoPathName,
    component: GenericNewVideoFormComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full'
  },{
    path: constants.newVideoPathName,
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
