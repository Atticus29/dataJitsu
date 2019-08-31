import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-payment-or-annotation-details',
  templateUrl: './payment-or-annotation-details.component.html',
  styleUrls: ['./payment-or-annotation-details.component.scss']
})
export class PaymentOrAnnotationDetailsComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
