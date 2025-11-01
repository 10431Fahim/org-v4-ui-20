import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-jatio-nirbahi-comitte',
  templateUrl: './jatio-nirbahi-comitte.component.html',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  styleUrls: ['./jatio-nirbahi-comitte.component.scss']})
export class JatioNirbahiComitteComponent implements OnInit {

  constructor(
    ) { }

  ngOnInit(): void {
  }

}
