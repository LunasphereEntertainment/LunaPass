import { Component, OnInit } from '@angular/core';
import { AccountListing, LunaPassService } from '../luna-pass.service';
import { faLockOpen, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-account-listing',
  templateUrl: './account-listing.component.html',
  styleUrls: ['./account-listing.component.css'],
})
export class AccountListingComponent implements OnInit {
  accountList: AccountListing[] | undefined;

  showIcon = faLockOpen;
  editIcon = faPen;
  deleteIcon = faTimes;

  constructor(private service: LunaPassService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.service.accountsChanged.subscribe((newList) => {
      this.accountList = newList;
    });
    this.accountList = this.service.accounts;
    // this.service.listAccounts().subscribe(
    //   (listing) => {
    //     this.accountList = listing;
    //   },
    //   (err) => {
    //     console.error(err);
    //   },
    // );
  }
}
