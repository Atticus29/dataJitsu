import { Component, OnInit } from '@angular/core';

import { AuthorizationService } from '../authorization.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-verify-email-address',
  templateUrl: './verify-email-address.component.html',
  styleUrls: ['./verify-email-address.component.scss']
})
export class VerifyEmailAddressComponent extends BaseComponent implements OnInit {

  constructor(public authService: AuthorizationService) {
    super();
  }

  ngOnInit() {
  }

}
