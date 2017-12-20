import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YoutubeComponent } from './youtube/youtube.component';
import { NewMatchComponent } from './new-match/new-match.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { TestDbComponent } from './test-db/test-db.component';

const appRoutes: Routes = [
  {
  path: '',
  component: YoutubeComponent,
  pathMatch: 'full'
},{
  path: 'newmatch',
  component: NewMatchComponent,
  pathMatch: 'full'
},{
  path: 'createaccount',
  component: CreateAccountComponent,
  pathMatch: 'full'
},{
  path: 'populatedb',
  component: TestDbComponent,
  pathMatch: 'full'
}
 ];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
