import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserAccount } from '../auth.models';
import { Router } from '@angular/router';
import { LunaPassService } from "../../luna-pass.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  usernameField = new FormControl('');
  passwordField = new FormControl('');

  errMsg = '';

  constructor(private service: AuthService, private router: Router, private passService: LunaPassService) {}

  login() {
    const account = new UserAccount(
      this.usernameField.value,
      this.passwordField.value,
    );

    this.service.login(account).subscribe(
      (account) => {
        if (account.token) {
          localStorage.setItem('token', account.token);

          this.passService.reload();

          this.router.navigateByUrl('/accounts');
        }
      },
      (err) => {
        this.errMsg = err;
      },
    );
  }
}
