import {Component, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-sohojogi-songothon',
  templateUrl: './sohojogi-songothon.component.html',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  styleUrls: ['./sohojogi-songothon.component.scss']})
export class SohojogiSongothonComponent implements OnInit {

  constructor(
    public translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

}
