import { MaterializeModule } from 'angular2-materialize'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { AllMatchesComponent } from './all-matches/all-matches.component';
import { AnnotationDisplayComponent } from './annotation-display/annotation-display.component';
import { D3Service } from './d3.service';
import { NotfoundComponent } from './notfound/notfound.component';
import { UserStatusReportComponent } from './user-status-report/user-status-report.component';
import { PaymentOrAnnotationDetailsComponent } from './payment-or-annotation-details/payment-or-annotation-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatchDataSource } from './matchDataSource.model';
import { DynamicDatabase } from './dynamicDatabase.model';
import {
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
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { TemporaryComponent } from './temporary/temporary.component';
import { AnnotationDataDisplayComponent } from './annotation-data-display/annotation-data-display.component';


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
    AnnotationDataDisplayComponent
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
    MatRadioModule
  ],
  providers: [AuthorizationService, DatabaseService, ProtectionGuard, D3Service, ValidationService, TextTransformationService, MatchDataSource, DynamicDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
