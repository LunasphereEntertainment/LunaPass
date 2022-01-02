import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountListingComponent } from './account-listing/account-listing.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';

const routes: Routes = [
  { path: 'accounts', component: AccountListingComponent },
  { path: 'details/:id', component: AccountDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
