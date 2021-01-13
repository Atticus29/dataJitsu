import { FormQuestionBase } from './formQuestionBase.model';

export class SlideToggleQuestion extends FormQuestionBase<string> {
  controlType = "toggle";
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
