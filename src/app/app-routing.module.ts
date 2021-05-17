import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadChildren: () =>
      import('./feat/folder/folder.module').then((m) => m.FolderPageModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./feat/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'editor',
    loadChildren: () =>
      import('./feat/editor/editor.module').then((m) => m.EditorModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./feat/settings/settings.module').then((m) => m.SettingsModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
