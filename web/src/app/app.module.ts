import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountListingComponent } from './account-listing/account-listing.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [AppComponent, AccountListingComponent, AccountDetailComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: { allowedDomains: ['localhost:3000'], tokenGetter: tokenGetter },
    }),
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: 'BASE_URL', useValue: environment.baseUrl }],
  bootstrap: [AppComponent],
})
export class AppModule {}
