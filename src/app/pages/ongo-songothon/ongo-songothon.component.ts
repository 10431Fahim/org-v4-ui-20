import {Component, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-ongo-songothon',
  templateUrl: './ongo-songothon.component.html',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  styleUrls: ['./ongo-songothon.component.scss']})
export class OngoSongothonComponent implements OnInit {

  constructor(
    public translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

}
