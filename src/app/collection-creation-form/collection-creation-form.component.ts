import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import { FormQuestionBase }    from '../formQuestionBase.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-collection-creation-form',
  templateUrl: './collection-creation-form.component.html',
  styleUrls: ['./collection-creation-form.component.scss']
})
export class CollectionCreationFormComponent implements OnInit {
  private localQuestions: Observable<FormQuestionBase<any>[]>;

  constructor(service: QuestionService) {
    this.localQuestions = service.getNewCollectionQuestions();
  }

  ngOnInit() {
  }

}
