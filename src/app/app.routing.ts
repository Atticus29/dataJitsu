import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YoutubeComponent } from './youtube/youtube.component';

const appRoutes: Routes = [
  {
  path: '',
  component: YoutubeComponent
  },
 ];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
