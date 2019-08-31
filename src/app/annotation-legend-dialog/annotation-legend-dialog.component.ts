import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-annotation-legend-dialog',
  templateUrl: './annotation-legend-dialog.component.html',
  styleUrls: ['./annotation-legend-dialog.component.scss']
})
export class AnnotationLegendDialogComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
