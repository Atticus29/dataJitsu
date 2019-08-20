import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-verify-email-address',
  templateUrl: './verify-email-address.component.html',
  styleUrls: ['./verify-email-address.component.scss']
})
export class VerifyEmailAddressComponent implements OnInit {

  constructor(public authService: AuthorizationService) { }

  ngOnInit() {
  }

}
