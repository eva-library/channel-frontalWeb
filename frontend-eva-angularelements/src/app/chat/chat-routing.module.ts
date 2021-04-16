import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { ChatComponent } from './components/chat/chat.component';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';

import { FormRequiredGuard } from './guards/formrequired.guard';

const APP_ROUTES: Routes = [
  {path: 'customerForm', component: CustomerFormComponent, canActivate: [FormRequiredGuard]},
  {path: 'chat', component: ChatComponent},
  {path: 'feedbackForm', component: FeedbackFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(APP_ROUTES)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
