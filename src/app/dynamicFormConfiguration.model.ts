import { FormQuestionBase } from "./formQuestionBase.model";
export class DynamicFormConfiguration {
  // public includeSubmitButton: boolean = true;
  // public idOfDynamicFormComponentToAttachTo: string = null;
  // public includeSubmitButton: boolean, public attachToPreviousFormGroupStatus: boolean,
  // public gridLengthsForInput: number = 12;
  // public gridLengthsForButtons: number = 12;
  constructor(
    public originalQuestionGroup: FormQuestionBase<string>[],
    public supplementaryQuestionGroup: FormQuestionBase<string>[],
    public submitButtonDisplay: String
  ) {
    // public gridLengthsForInput: number, public gridLengthsForButtons: number
    // this.gridLengthsForInput = gridLengthsForInput;
    // this.gridLengthsForButtons = gridLengthsForButtons;
  }

  getOriginalQuestionGroup(): FormQuestionBase<string>[] {
    return this.originalQuestionGroup;
  }

  getSupplementaryQuestionGroup(): FormQuestionBase<string>[] {
    return this.supplementaryQuestionGroup;
  }

  getSubmitButtonDisplay() {
    return this.submitButtonDisplay;
  }

  // getGridLengthsForInput(): number{
  //   return this.gridLengthsForInput;
  // }

  // getGridLengthsForButtons(): number{
  //   return this.gridLengthsForButtons;
  // }
}
