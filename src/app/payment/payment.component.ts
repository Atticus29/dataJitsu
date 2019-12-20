import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

import { AuthorizationService } from '../authorization.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {

  }
}
