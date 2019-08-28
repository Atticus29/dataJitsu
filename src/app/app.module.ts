import { MaterializeModule } from 'angular2-materialize'
import { RatingModule } from 'ng-starrating';
import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { masterFirebaseConfig } from './api-keys';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AppComponent } from './app.component';
import { YoutubeComponent } from './youtube/youtube.component';
import { routing } from './app.routing';
import { NewMatchComponent } from './new-match/new-match.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { TestDbComponent } from './test-db/test-db.component';
import { LandingComponent } from './landing/landing.component';
import { MatchDisplayComponent } from './match-display/match-display.component';
import { AuthorizationService } from './authorization.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { DatabaseService } from './database.service';
import { TextTransformationService } from './text-transformation.service';
import { ValidationService } from './validation.service';
import { LoginComponent } from './login/login.component';
import { ProtectionGuard } from './protection.guard';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { AllMatchesComponent } from './all-matches/all-matches.component';
import { AnnotationDisplayComponent } from './annotation-display/annotation-display.component';
import { D3Service } from './d3.service';
import { NotfoundComponent } from './notfound/notfound.component';
import { UserStatusReportComponent } from './user-status-report/user-status-report.component';
import { PaymentOrAnnotationDetailsComponent } from './payment-or-annotation-details/payment-or-annotation-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material';
// import { CdkTreeModule } from '@angular/cdk/tree';
import { MatchDataSource } from './matchDataSource.model';
import { HorizontalTimelineComponent } from './horizontal-timeline/horizontal-timeline.component';
import { DynamicDatabase } from './dynamicDatabase.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EmailLoginDialog } from './emailLoginDialog.model';

// import {
//   MatAutocompleteModule,
//   MatBadgeModule,
//   MatBottomSheetModule,
//   MatButtonModule,
//   MatButtonToggleModule,
//   MatCardModule,
//   MatCheckboxModule,
//   MatChipsModule,
//   MatDatepickerModule,
//   MatDialogModule,
//   MatDividerModule,
//   MatExpansionModule,
//   MatGridListModule,
//   MatIconModule,
//   MatInputModule,
//   MatListModule,
//   MatMenuModule,
//   MatNativeDateModule,
//   MatPaginatorModule,
//   MatProgressBarModule,
//   MatProgressSpinnerModule,
//   MatRadioModule,
//   MatRippleModule,
//   MatSelectModule,
//   MatSidenavModule,
//   MatSliderModule,
//   MatSlideToggleModule,
//   MatSnackBarModule,
//   MatSortModule,
//   MatStepperModule,
//   MatTableModule,
//   MatTabsModule,
//   MatToolbarModule,
//   MatTooltipModule,
//   MatTreeModule
// } from '@angular/material';

import {NgModule} from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';

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


export const firebaseConfig = {
  apiKey: masterFirebaseConfig.apiKey,
  authDomain: masterFirebaseConfig.authDomain,
  databaseURL: masterFirebaseConfig.databaseURL,
  storageBucket: masterFirebaseConfig.storageBucket
};

@NgModule({
  declarations: [
    AppComponent,
    YoutubeComponent,
    NewMatchComponent,
    CreateAccountComponent,
    TestDbComponent,
    LandingComponent,
    MatchDisplayComponent,
    LoginComponent,
    AllMatchesComponent,
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
    SubmissionAnnotationDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MaterializeModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    CdkTreeModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTableModule,
    MatSelectModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTreeModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatChipsModule,
    MatRippleModule,
    MatRadioModule,
    RatingModule,
    MatDialogModule,
    MatChipsModule,
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,
  ],
  providers: [AuthorizationService, DatabaseService, ProtectionGuard, D3Service, ValidationService, TextTransformationService, MatchDataSource, DynamicDatabase, AngularFireAuthGuard, EmailLoginDialog],
  bootstrap: [AppComponent],
  entryComponents: [EmailLoginDialogComponent, AnnotationLegendDialogComponent]
})
export class AppModule { }
