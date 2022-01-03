import { EventEmitter, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Account } from '../../../src/accounts/account.model';
import { single, takeLast } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LunaPassService {
  accounts: AccountListing[] = [];
  accountsChanged: EventEmitter<AccountListing[]> = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private router: Router,
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
    const operation = this.http.post<Account>(
      `${this.baseUrl}/accounts/new`,
      account,
    );

    operation.pipe(single()).subscribe(() => this.loadAccounts());

    return operation;
  }

  updateAccount(accountId: number, account: Account) {
    const operation = this.http.put(
      `${this.baseUrl}/accounts/${accountId}`,
      account,
    );

    operation.pipe(single()).subscribe(() => this.loadAccounts());

    return operation;
  }

  deleteAccount(accountId: number) {
    const operation = this.http.delete(`${this.baseUrl}/accounts/${accountId}`);

    operation.pipe(single()).subscribe(() => {
      this.loadAccounts();
    });

    return operation;
  }

  search(term: string) {
    if (term.length > 0) {
      this.accountsChanged.emit(
        this.accounts.filter(
          (acc) =>
            acc.name.toLowerCase().includes(term.toLowerCase()) ||
            acc.url?.toLowerCase().includes(term.toLowerCase()),
        ),
      );
    } else {
      this.accountsChanged.emit(this.accounts);
    }
  }

  reload() {
    this.loadAccounts();
  }
}

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
