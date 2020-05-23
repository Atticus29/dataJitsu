import { RatingModule } from 'ng-starrating';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { masterFirebaseConfig } from './api-keys';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AppComponent } from './app.component';
import { YoutubeComponent } from './youtube/youtube.component';
import { routing } from './app.routing';
import { NewVideoComponent } from './new-video/new-video.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { TestDbComponent } from './test-db/test-db.component';
import { LandingComponent } from './landing/landing.component';
import { VideoDisplayComponent } from './video-display/video-display.component';
import { AuthorizationService } from './authorization.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { DatabaseService } from './database.service';
import { TextTransformationService } from './text-transformation.service';
import { ValidationService } from './validation.service';
import { LoginComponent } from './login/login.component';
import { ProtectionGuard } from './protection.guard';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { AllVideosComponent } from './all-videos/all-videos.component';
import { AnnotationDisplayComponent } from './annotation-display/annotation-display.component';
import { D3Service } from './d3.service';
import { NotfoundComponent } from './notfound/notfound.component';
import { UserStatusReportComponent } from './user-status-report/user-status-report.component';
import { PaymentOrAnnotationDetailsComponent } from './payment-or-annotation-details/payment-or-annotation-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkTreeModule } from '@angular/cdk/tree';
import { VideoDataSource } from './videoDataSource.model';
import { HorizontalTimelineComponent } from './horizontal-timeline/horizontal-timeline.component';
import { DynamicDatabase } from './dynamicDatabase.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EmailLoginDialog } from './emailLoginDialog.model';
import { HelperService } from './helper.service';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { TemporaryComponent } from './temporary/temporary.component';
import { AnnotationDataDisplayComponent } from './annotation-data-display/annotation-data-display.component';
import { EmailLoginDialogComponent } from './email-login-dialog/email-login-dialog.component';
import { VerifyEmailAddressComponent } from './verify-email-address/verify-email-address.component';
import { PaymentComponent } from './payment/payment.component';
import { AnnotatedMovesDisplayComponent } from './annotated-moves-display/annotated-moves-display.component';
import { AdminComponent } from './admin/admin.component';
import { LogoutComponent } from './logout/logout.component';
import { BaseComponent } from './base/base.component';
import { UnsuccessfulAnnotationDirective } from './unsuccessful-annotation.directive';
import { AnnotationLegendDialogComponent } from './annotation-legend-dialog/annotation-legend-dialog.component';
import { SubmissionAnnotationDirective } from './submission-annotation.directive';
import { NewsComponent } from './news/news.component';
import { FaqComponent } from './faq/faq.component';
import { AnnotationScoredPointsDirective } from './annotation-scored-points.directive';
import { UserInfoComponent } from './user-info/user-info.component';
import { IndividualMatchDataDisplayComponent } from './individual-match-data-display/individual-match-data-display.component';
import { WinDrawDirective } from './win-draw.directive';
import { FlaggedAnnotationDirective } from './flagged-annotation.directive';
import { AdvantageDirective } from './advantage.directive';
import { AthleteNameApprovalComponent } from './athlete-name-approval/athlete-name-approval.component';
import { NewAthleteNameDialogComponent } from './new-athlete-name-dialog/new-athlete-name-dialog.component';
import { NewMoveDialogComponent } from './new-move-dialog/new-move-dialog.component';
import { MoveNameApprovalComponent } from './move-name-approval/move-name-approval.component';
import { StripeComponent } from './stripe/stripe.component';
import { SelfMatchesUserInfoComponent } from './self-matches-user-info/self-matches-user-info.component';
import { MatchActionDelimiterDirective } from './match-action-delimiter.directive';
import { NewTournamentNameDialogComponent } from './new-tournament-name-dialog/new-tournament-name-dialog.component';
import { TournamentNameApprovalComponent } from './tournament-name-approval/tournament-name-approval.component';
import { BaseDialogComponent } from './base-dialog/base-dialog.component';
import { NewWeightClassDialogComponent } from './new-weight-class-dialog/new-weight-class-dialog.component';
import { WeightClassNameApprovalComponent } from './weight-class-name-approval/weight-class-name-approval.component';
import { BaseApprovalComponent } from './base-approval/base-approval.component';
import { NewNoGiRankDialogComponent } from './new-no-gi-rank-dialog/new-no-gi-rank-dialog.component';
import { NewAgeClassDialogComponent } from './new-age-class-dialog/new-age-class-dialog.component';
import { NewLocationNameDialogComponent } from './new-location-name-dialog/new-location-name-dialog.component';


export const firebaseConfig = {
  apiKey: masterFirebaseConfig.apiKey,
  projectId: masterFirebaseConfig.projectId,
  authDomain: masterFirebaseConfig.authDomain,
  databaseURL: masterFirebaseConfig.databaseURL,
  storageBucket: masterFirebaseConfig.storageBucket
};

@NgModule({
  declarations: [
    AppComponent,
    YoutubeComponent,
    NewVideoComponent,
    CreateAccountComponent,
    TestDbComponent,
    LandingComponent,
    VideoDisplayComponent,
    LoginComponent,
    AllVideosComponent,
    AnnotationDisplayComponent,
    NotfoundComponent,
    UserStatusReportComponent,
    PaymentOrAnnotationDetailsComponent,
    TemporaryComponent,
    AnnotationDataDisplayComponent,
    HorizontalTimelineComponent,
    EmailLoginDialogComponent,
    VerifyEmailAddressComponent,
    PaymentComponent,
    AnnotatedMovesDisplayComponent,
    AdminComponent,
    LogoutComponent,
    BaseComponent,
    UnsuccessfulAnnotationDirective,
    AnnotationLegendDialogComponent,
    SubmissionAnnotationDirective,
    NewsComponent,
    FaqComponent,
    AnnotationScoredPointsDirective,
    UserInfoComponent,
    IndividualMatchDataDisplayComponent,
    WinDrawDirective,
    FlaggedAnnotationDirective,
    AdvantageDirective,
    AthleteNameApprovalComponent,
    NewAthleteNameDialogComponent,
    NewMoveDialogComponent,
    MoveNameApprovalComponent,
    StripeComponent,
    SelfMatchesUserInfoComponent,
    MatchActionDelimiterDirective,
    NewTournamentNameDialogComponent,
    TournamentNameApprovalComponent,
    BaseDialogComponent,
    NewWeightClassDialogComponent,
    WeightClassNameApprovalComponent,
    BaseApprovalComponent,
    NewNoGiRankDialogComponent,
    NewAgeClassDialogComponent,
    NewLocationNameDialogComponent
  ],
  imports: [
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserAnimationsModule,
    BrowserModule,
    CdkTreeModule,
    FormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    RatingModule,
    ReactiveFormsModule,
    routing,
    NgxYoutubePlayerModule,
  ],
  providers: [AuthorizationService, DatabaseService, ProtectionGuard, D3Service, ValidationService, TextTransformationService, VideoDataSource, DynamicDatabase, AngularFireAuthGuard, HelperService, AngularFireFunctions],
  bootstrap: [AppComponent]
})
export class AppModule { }
