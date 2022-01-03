import { Component, OnInit } from '@angular/core';
import { AccountListing, LunaPassService } from '../luna-pass.service';
import {
  faLockOpen,
  faPencilAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { PassViewComponent } from '../dialogs/pass-view/pass-view.component';
import { GeneratorComponent } from '../dialogs/generator/generator.component';

@Component({
  selector: 'app-account-listing',
  templateUrl: './account-listing.component.html',
  styleUrls: ['./account-listing.component.css'],
})
export class AccountListingComponent implements OnInit {
  accountList: AccountListing[] | undefined;

  showIcon = faLockOpen;
  editIcon = faPencilAlt;
  deleteIcon = faTrash;

  constructor(private service: LunaPassService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.service.accountsChanged.subscribe((newList) => {
      this.accountList = newList;
    });
    this.accountList = this.service.accounts;
  }

  viewPassword(accountId: number) {
    const dialogInstance = this.dialog.open(PassViewComponent, {
      width: '550px',
      data: {
        accountId,
      },
    });
  }

  deleteAccount(accountId: number) {
    const dialogInstance = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
    });

    dialogInstance.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.service.deleteAccount(accountId).subscribe(() => {
          // Do nothing.
        });
      } else {
        // Do nothing.
      }
    });
  }
}
