import { FormQuestionBase } from './formQuestionBase.model';
export class DynamicFormConfiguration {
  // private includeSubmitButton: boolean = true;
  // private idOfDynamicFormComponentToAttachTo: string = null;
  // private includeSubmitButton: boolean, private attachToPreviousFormGroupStatus: boolean,
  constructor(private originalQuestionGroup: FormQuestionBase<string>[]) {
   }

   getOriginalQuestionGroup(){
     return this.originalQuestionGroup;
   }
}
