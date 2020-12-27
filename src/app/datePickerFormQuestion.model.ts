import { FormQuestionBase } from './formQuestionBase.model';

export class DatePickerQuestion extends FormQuestionBase<string> {
  controlType = "datepicker";
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
