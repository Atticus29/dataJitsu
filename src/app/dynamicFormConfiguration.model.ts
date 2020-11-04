import { FormQuestionBase } from './formQuestionBase.model';
export class DynamicFormConfiguration {
  // private includeSubmitButton: boolean = true;
  // private idOfDynamicFormComponentToAttachTo: string = null;
  // private includeSubmitButton: boolean, private attachToPreviousFormGroupStatus: boolean,
  // private gridLengthsForInput: number = 12;
  // private gridLengthsForButtons: number = 12;
  constructor(private originalQuestionGroup: FormQuestionBase<string>[], private submitButtonDisplay: String) { //, private gridLengthsForInput: number, private gridLengthsForButtons: number
    // this.gridLengthsForInput = gridLengthsForInput;
    // this.gridLengthsForButtons = gridLengthsForButtons;
   }

   getOriginalQuestionGroup(){
     return this.originalQuestionGroup;
   }

   getSubmitButtonDisplay(){
     return this.submitButtonDisplay;
   }

   // getGridLengthsForInput(): number{
   //   return this.gridLengthsForInput;
   // }

   // getGridLengthsForButtons(): number{
   //   return this.gridLengthsForButtons;
   // }
}
