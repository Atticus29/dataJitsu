import { FormQuestionBase } from './formQuestionBase.model';

export class AutocompleteQuestion extends FormQuestionBase<string> {
  controlType = "autocomplete";
  type: string;
  enableAddNew: boolean;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.enableAddNew = typeof options['enableAddNew'] === "boolean" ? options['enableAddNew'] : true;
  }
}
