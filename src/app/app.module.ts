import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { YoutubeComponent } from './youtube/youtube.component';
import { routing } from './app.routing';
import { NewMatchComponent } from './new-match/new-match.component';

@NgModule({
  declarations: [
    AppComponent,
    YoutubeComponent,
    NewMatchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
