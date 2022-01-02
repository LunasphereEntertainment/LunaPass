import { EventEmitter, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../../../src/accounts/account.model';

@Injectable({
  providedIn: 'root',
})
export class LunaPassService {
  accounts: AccountListing[] = [];
  accountsChanged: EventEmitter<AccountListing[]> = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
  ) {
    this.loadAccounts();
  }

  private loadAccounts() {
    this.http
      .get<Account[]>(`${this.baseUrl}/accounts/list`)
      .subscribe((listing) => {
        this.accounts = listing.map((acc) => new AccountListing(acc));

        this.accountsChanged.emit(this.accounts);
      });
  }

  listAccounts() {
    return this.accounts;
  }

  getAccount(accountId: number) {
    // return this.accounts.find((acc) => acc.id === accountId);
    return this.http.get<Account>(`${this.baseUrl}/accounts/${accountId}`);
  }

  addAccount(account: Account) {
    return this.http.post<Account>(`${this.baseUrl}/accounts/new`, account);
  }

  updateAccount(accountId: number, account: Account) {
    return this.http.put(`${this.baseUrl}/accounts/${accountId}`, account);
  }

  deleteAccount(accountId: number) {
    return this.http.delete(`${this.baseUrl}/accounts/${accountId}`);
  }
}

/* getFavicon(url?: string): string {
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
  } */

export class AccountListing extends Account {
  icon: string | undefined;

  constructor(acc: Account) {
    super(acc.id, acc.name, acc.username, acc.password, acc.url);
    this.icon = this.iconFromUrl();
  }

  iconFromUrl() {
    if (this.url) {
      const re = /https?:\/\/([A-z\.]+)\/?/;
      const matches = this.url.match(re);

      if (matches) {
        return `${matches[0]}/favicon.ico`;
      }
    }

    return;
  }
}
