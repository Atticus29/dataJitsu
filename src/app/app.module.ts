import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';
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
    MatchDisplayComponent
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
    AngularFireAuthModule
  ],
  providers: [AuthorizationService, DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
