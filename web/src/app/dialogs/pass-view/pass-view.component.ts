import { Component, Inject, OnInit } from '@angular/core';
import { LunaPassService } from '../../luna-pass.service';
import { Account } from '../../../../../src/accounts/account.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './pass-view.component.html',
  styleUrls: ['./pass-view.component.css'],
})
export class PassViewComponent implements OnInit {
  details: Account | undefined;

  constructor(
    private service: LunaPassService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<PassViewComponent>,
  ) {}

  ngOnInit(): void {
    this.service.getAccount(this.data.accountId).subscribe((details) => {
      this.details = details;
    });
  }

  dismiss() {
    this.dialogRef.close();
  }
}
