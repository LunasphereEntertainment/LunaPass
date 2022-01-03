import { Component, OnInit } from '@angular/core';
import {
  faArrowCircleLeft,
  faCheck,
  faRandom,
  faRedoAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';
import { LunaPassService } from '../luna-pass.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../../../src/accounts/account.model';
import { GeneratorComponent } from '../dialogs/generator/generator.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css'],
})
export class AccountDetailComponent implements OnInit {
  accountId = 0;

  generateIcon = faRandom;
  backIcon = faArrowCircleLeft;
  saveIcon = faCheck;
  discardIcon = faRedoAlt;

  accountForm = new FormGroup({
    name: new FormControl(''),
    url: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private service: LunaPassService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.route.paramMap.subscribe((params) => {
      if (params.has('id')) {
        const accountId = parseInt(<string>params.get('id'));
        if (!isNaN(accountId)) {
          this.accountId = accountId;
        }
      }
    });
  }

  loadDetails() {
    if (this.accountId > 0) {
      this.service.getAccount(this.accountId).subscribe((details) => {
        this.detailsToForm(details);
      });
    }
  }

  save() {
    const accountDetails = this.formToDetails();
    if (this.accountId > 0) {
      this.service
        .updateAccount(this.accountId, accountDetails)
        .subscribe(() => {
          // Redirect to home
          this.returnToListing();
        });
    } else {
      this.service.addAccount(accountDetails).subscribe(() => {
        // Redirect to home
        this.returnToListing();
      });
    }
  }

  openGenerator() {
    const dialogRef = this.dialog.open(GeneratorComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((newPassword) => {
      if (newPassword) {
        this.accountForm.patchValue({ password: newPassword });
      }
    });
  }

  ngOnInit(): void {
    this.loadDetails();
  }

  detailsToForm(details: Account) {
    this.accountForm.patchValue({
      name: details.name,
      url: details.url,
      username: details.username,
      password: details.password,
    });
  }

  formToDetails(): Account {
    return new Account(
      this.accountId,
      this.accountForm.get('name')?.value,
      this.accountForm.get('username')?.value,
      this.accountForm.get('password')?.value,
      this.accountForm.get('url')?.value,
    );
  }

  getFavicon(url?: string): string {
    if (!url) {
      return ``;
    }

    const re = /https?:\/\/([A-z\.]+)\/?/;
    const matches = url.match(re);

    if (matches) {
      return `${matches[0]}/favicon.ico`;
    } else {
      return ``;
    }
  }

  returnToListing() {
    this.router.navigateByUrl('/accounts');
  }
}
