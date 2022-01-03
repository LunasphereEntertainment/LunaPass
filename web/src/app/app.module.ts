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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { PassViewComponent } from './dialogs/pass-view/pass-view.component';
import { GeneratorComponent } from './dialogs/generator/generator.component';
import { LoginComponent } from './luna-auth/login/login.component';
import { AuthService } from './luna-auth/auth.service';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    AccountListingComponent,
    AccountDetailComponent,
    ConfirmDialogComponent,
    PassViewComponent,
    GeneratorComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        allowedDomains: ['192.168.1.2:3000', 'localhost:3000'],
        tokenGetter: tokenGetter,
      },
    }),
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatDialogModule,
  ],
  providers: [
    AuthService,
    { provide: 'BASE_URL', useValue: environment.baseUrl },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
