import { Component } from '@angular/core';
import {
  faPlusCircle,
  faPowerOff,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { LunaPassService } from './luna-pass.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'LunaPass';

  searchIcon = faSearch;
  addIcon = faPlusCircle;
  logoutIcon = faPowerOff;

  searchField = new FormControl('');

  constructor(
    private router: Router,
    private service: LunaPassService,
    private dialog: MatDialog,
  ) {}

  runSearch() {
    this.router.navigateByUrl('/accounts').then(() => {
      this.service.search(this.searchField.value);
    });
  }

  delayedRun() {
    const currentValue = this.searchField.value;

    setTimeout(() => {
      const newValue = this.searchField.value;

      if (currentValue === newValue) {
        this.runSearch();
      }
    }, 350);
  }

  logout() {
    // this.dialog.open(ConfirmDialogComponent, {})
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
