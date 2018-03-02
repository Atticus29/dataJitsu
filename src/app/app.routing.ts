import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YoutubeComponent } from './youtube/youtube.component';
import { NewMatchComponent } from './new-match/new-match.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { TestDbComponent } from './test-db/test-db.component';
import { LandingComponent } from './landing/landing.component';
import { MatchDisplayComponent } from './match-display/match-display.component';
import { LoginComponent } from './login/login.component';
import { ProtectionGuard } from './protection.guard';
import { AllMatchesComponent } from './all-matches/all-matches.component';
import { NotfoundComponent } from './notfound/notfound.component';
const appRoutes: Routes = [
  {
  path: '',
  component: LoginComponent,
  pathMatch: 'full'
},{
  path: 'newmatch',
  component: NewMatchComponent,
  canActivate: [ProtectionGuard],
  pathMatch: 'full'
},{
  path: 'createaccount',
  component: CreateAccountComponent,
  pathMatch: 'full'
},{
  path: 'populatedb',
  component: TestDbComponent,
  pathMatch: 'full'
},{
  path: 'landing',
  component: LandingComponent,
  canActivate: [ProtectionGuard],
  pathMatch: 'full'
},{
  path: 'matches',
  component: AllMatchesComponent,
  canActivate: [ProtectionGuard],
  pathMatch: 'full'
},{
  path: 'matches/:matchId',
  component: MatchDisplayComponent,
  canActivate: [ProtectionGuard],
  pathMatch: 'full'
},{
  path: 'youtube',
  component: YoutubeComponent,
  pathMatch: 'full'
},{
  path: '**',
  component: NotfoundComponent,
  pathMatch: 'full'
}
 ];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
