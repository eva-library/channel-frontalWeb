import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemoComponent } from './demo/demo.component';

const APP_ROUTES: Routes = [
  { path: 'demo',  component: DemoComponent},
  { path: '', pathMatch: 'full', redirectTo: 'customerForm' },
  { path: '**', pathMatch: 'full', redirectTo: 'notFound' }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES,
    { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
