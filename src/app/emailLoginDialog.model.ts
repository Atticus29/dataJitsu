import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmailLoginDialogComponent } from './email-login-dialog/email-login-dialog.component';
import { Inject} from '@angular/core';
export interface DialogData {
  dataString: string;
}
export class EmailLoginDialog {

  constructor(
    public dialogRef: MatDialogRef<EmailLoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoclick(): void {
    this.dialogRef.close();
  }

}
