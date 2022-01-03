import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountListingComponent } from './account-listing/account-listing.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { LoginComponent } from './luna-auth/login/login.component';
import { LoginGuard } from './login.guard';

const routes: Routes = [
  {
    path: 'accounts',
    component: AccountListingComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'details/:id',
    component: AccountDetailComponent,
    canActivate: [LoginGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'accounts' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
