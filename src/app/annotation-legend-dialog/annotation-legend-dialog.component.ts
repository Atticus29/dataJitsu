import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../base/base.component';
import { constants } from '../constants';


@Component({
  selector: 'app-annotation-legend-dialog',
  templateUrl: './annotation-legend-dialog.component.html',
  styleUrls: ['./annotation-legend-dialog.component.scss']
})
export class AnnotationLegendDialogComponent extends BaseComponent implements OnInit {
  private localMinFlagCount: number = constants.numberOfFlagsAnAnnotationNeedsBeforeItIsDisplayedToDrawAttention;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
