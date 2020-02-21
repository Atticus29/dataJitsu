import { FormQuestionBase } from './formQuestionBase.model';

export class TextQuestion extends FormQuestionBase<string> {
  controlType = "textbox";
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
