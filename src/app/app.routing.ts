import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YoutubeComponent } from './youtube/youtube.component';
import { NewMatchComponent } from './new-match/new-match.component'

const appRoutes: Routes = [
  {
  path: '',
  component: YoutubeComponent,
  pathMatch: 'full'
},{
  path: 'newmatch',
  component: NewMatchComponent,
  pathMatch: 'full'
}
 ];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
