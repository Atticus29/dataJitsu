import { Component, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

import { DatabaseService } from '../database.service';
import { BaseComponent} from '../base/base.component';
import { FeedbackItem } from '../feedbackItem.model';

@Component({
  selector: 'app-feedback-view',
  templateUrl: './feedback-view.component.html',
  styleUrls: ['./feedback-view.component.scss']
})
export class FeedbackViewComponent extends BaseComponent implements OnInit {
  private localFeedback: FeedbackItem[];

  constructor(private databaseService: DatabaseService) {
    super();
  }

  ngOnInit() {
    this.databaseService.getFeedback().pipe(takeUntil(this.ngUnsubscribe)).subscribe(feedback =>{
      this.localFeedback = feedback;
    });
  }

}
