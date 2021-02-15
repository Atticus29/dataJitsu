import { FormQuestionBase } from './formQuestionBase.model';

export class PasswordTextQuestion extends FormQuestionBase<string> {
  controlType = "passwordtext";
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || 'password';
  }
}
