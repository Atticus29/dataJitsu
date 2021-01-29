import { FormQuestionBase } from './formQuestionBase.model';

export class AutocompleteQuestion extends FormQuestionBase<string> {
  controlType = "autocomplete";
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
