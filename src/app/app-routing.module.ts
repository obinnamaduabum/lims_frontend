import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '',
    loadChildren: () => import('src/app/landing-page/landing-page.module').then(m => m.LandingPageModule)
  },
  {
    path: 'lab-test',
    loadChildren: () => import('src/app/tests-module/tests.module').then(m => m.TestsModule ),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('src/app/dashboard-module/dashboard.module').then(m => m.DashboardModule ),
  },
  { path: '404' ,
    loadChildren: () => import('src/app/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
