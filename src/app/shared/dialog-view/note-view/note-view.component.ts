import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  imports: [
    MatIconButton,
    MatIcon
  ],
  standalone:true,
  styleUrls: ['./note-view.component.scss']
})
export class NoteViewComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NoteViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
  }


  /**
   * ON CLOSE DIALOG
   */
  onClose() {
    this.dialogRef.close()
  }

}
