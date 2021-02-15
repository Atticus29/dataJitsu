import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { of } from 'rxjs';

import { DropdownQuestion } from './dropdownQuestion.model';
import { FormQuestionBase }     from './formQuestionBase.model';
import { TextQuestion }  from './textFormQuestion.model';
import { AutocompleteQuestion } from './autocompleteQuestion.model';
import { PasswordTextQuestion } from './passwordTextFormQuestion.model';
import { SlideToggleQuestion } from './slideToggleFormQuestion.model';
import { DatePickerQuestion } from './datePickerFormQuestion.model';
import { Collection } from './collection.model';
import { OwnerQuestion } from './ownerQuestion.model';
import { DatabaseService } from './database.service';
import { constants } from './constants';

@Injectable()
export class QuestionService{
  constructor(private databaseService: DatabaseService){}

  private userNameQuestion: TextQuestion = new TextQuestion({
    key: 'userName',
    label: 'User Name',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: 'E.g., Ben Benson',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false,
  });

  private emailAddressQuestion: TextQuestion = new TextQuestion({
    key: 'emailAddress',
    label: 'Email Address',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: 'E.g., Ben.Benson@gmail.com',
    type: 'email',
    order: 1,
    submitAfterThisQuestion: false,
    isEmailAddress: true
  });

  private passwordQuestion: PasswordTextQuestion = new PasswordTextQuestion({
    key: 'password',
    label: 'Password',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'password',
    order: 1,
    submitAfterThisQuestion: false,
    minLength: 7
  });

  private confirmPasswordQuestion: PasswordTextQuestion = new PasswordTextQuestion({
    key: 'confirmPassword',
    label: 'Confirm Password',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'password',
    order: 1,
    submitAfterThisQuestion: false,
    minLength: 7,
    valueMustMatch: this.passwordQuestion,
    keyOfOtherQuestionWhereMatchIsDesired: 'password'
  });

  private gymAffiliationQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'gymAffiliation',
    label: 'Gym Affiliation',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: 'E.g., Straight Blast Gym',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false,
    autocompleteOptions: this.databaseService.getGymAffiliations(),
    enableAddNew: true,
    pathToCandidateValues: '/candidateGymAffiliations/',
    pathToConfirmedValues: '/gymAffiliations/'
  });

  private genderQuestion: DropdownQuestion = new DropdownQuestion({
    key: 'gender',
    label: 'Choose Gender',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: false,
    indentThisQuestion: true,
    type: 'dropdown',
    order: 2,
    dropdownOptions: constants.genderDropdownOptions,
    submitAfterThisQuestion: false
  });

  private giRankQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'giRank',
    label: 'Gi Rank',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: 'E.g., Black Belt',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false,
    autocompleteOptions: this.databaseService.getGiRanks(),
    enableAddNew: false,
    pathToCandidateValues: '/candidateGiRanks/',
    pathToConfirmedValues: '/giRanks/'
  });

  private noGiRankQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'noGiRank',
    label: 'No Gi Rank',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: 'E.g., Advanced',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false,
    autocompleteOptions: this.databaseService.getNoGiRanks(),
    enableAddNew: false,
    pathToCandidateValues: '/candidateNoGiRanks/',
    pathToConfirmedValues: '/noGiRanks/'
  });

  private weightQuestion: TextQuestion = new TextQuestion({
    key: 'weight',
    label: 'Weight in kg',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: 'E.g., 70.3',
    type: 'number',
    order: 1,
    submitAfterThisQuestion: false,
  });

  private ageQuestion: TextQuestion = new TextQuestion({
    key: 'age',
    label: 'Age',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: 'E.g., 46',
    type: 'number',
    order: 1,
    submitAfterThisQuestion: true,
  });


  private passwordTextTestQuestion: PasswordTextQuestion = new PasswordTextQuestion({
    key: 'passwordUpdate',
    label: 'Password',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'password',
    order: 1,
    submitAfterThisQuestion: false,
    minLength: 7
  });

  private shamQuestion: TextQuestion = new TextQuestion({
    key: '',
    label: '',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true
  });

  private ageClassEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'ageClassUpdate',
    label: 'Age Class',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
    autocompleteOptions: this.databaseService.getAgeClasses(),
    enableAddNew: true,
    pathToCandidateValues: '/candidateAgeClasses/',
    pathToConfirmedValues: '/ageClasses/'
  });

  private weightClassEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'weightClassUpdate',
    label: 'Weight Class',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
    autocompleteOptions: this.databaseService.getWeightClasses(),
    enableAddNew: true,
    pathToCandidateValues: '/candidateWeightClasses/',
    pathToConfirmedValues: '/weightClasses/'
  });

  private giNogiEditQuestion: SlideToggleQuestion = new SlideToggleQuestion({
    key: 'giNogiUpdate',
    label: 'Gi',
    secondLabel: 'No Gi',
    value: 'No Gi', //must always match second label
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
  });

  private tournamentNameEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'tournamentNameUpdate',
    label: 'Tournament Name',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
    autocompleteOptions: this.databaseService.getTournamentNames(),
    enableAddNew: true,
    pathToCandidateValues: '/candidateTournamentNames/',
    pathToConfirmedValues: '/tournamentNames/'
  });

  private dateEditQuestion: DatePickerQuestion = new DatePickerQuestion({
    key: 'dateUpdate',
    label: 'Date',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
  });

  private locationEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'locationUpdate',
    label: 'Location',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
    autocompleteOptions: this.databaseService.getLocations(),
    enableAddNew: true,
    pathToCandidateValues: '/candidateLocationNames/',
    pathToConfirmedValues: '/locations/'
  });

  private rankEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'rankUpdate',
    label: 'Rank',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
    autocompleteOptions: this.databaseService.getAllRanks(),
    enableAddNew: false,
  });

  private individualOneEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'individualOneUpdate',
    label: 'Individual 1 Name',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
    autocompleteOptions: this.databaseService.getIndividualNames(),
    enableAddNew: true,
    pathToCandidateValues: '/candidateAthleteNames/',
    pathToConfirmedValues: '/individualNames/'
  });

  private individualTwoEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'individualTwoUpdate',
    label: 'Individual 2 Name',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: true,
    placeHolder: '',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: true,
    autocompleteOptions: this.databaseService.getIndividualNames(),
    enableAddNew: false,
    pathToCandidateValues: '/candidateAthleteNames/',
    pathToConfirmedValues: '/individualNames/'
  });

  private testIndividualOneEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'individualOneUpdate',
    label: 'Individual 1 Name',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'Individual 1',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false,
    autocompleteOptions: this.databaseService.getIndividualNames(),
    enableAddNew: false,
    pathToCandidateValues: '/candidateAthleteNames/',
    pathToConfirmedValues: '/individualNames'
  });

  private testIndividualTwoEditQuestion: AutocompleteQuestion = new AutocompleteQuestion({
    key: 'individualTwoUpdate',
    label: 'Individual 2 Name',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'Individual 2',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false,
    autocompleteOptions: this.databaseService.getGiRanks(),
    enableAddNew: true,
    pathToCandidateValues: '/candidateAthleteNames/',
    pathToConfirmedValues: '/individualNames'
  });

  // private userNameQuestion: TextQuestion = new TextQuestion({ //TODO create user questions here
  //   key: 'usernameQuestion' + i,
  //   label: 'User Name',
  //   value: '',
  //   required: currentOwnerQuestion.question==="Video URL"? true:false,
  //   giveOptionToAnswerThisQuestionMultipleTimes: false,
  //   disableAddButtonIfCurrentValueIsBlank: false,
  //   groupLabel: 'Questions about the video',
  //   disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: true,
  //   pairThisQuestionWithPreviousQuestion: currentOwnerQuestion.type === "Dropdown"? true:false,
  //   isThisQuestionTheLastOfAQuestionGroup: false, //i<ownerQuestions.length-1 ? false:true,
  //   indentThisQuestion: false,
  //   placeHolder: '',
  //   smallSize: 12,
  //   mediumSize: 6,
  //   largeSize: 6,
  //   // order: 1,
  //   controlType: currentOwnerQuestion.questionType,
  //   type: currentOwnerQuestion.questionType,
  //   submitAfterThisQuestion: i<ownerQuestions.length-1 ? false:true,
  //   dropdownOptions: []
  // });
  private secondTestSlideToggle: SlideToggleQuestion = new SlideToggleQuestion({
    key: 'secondTestSlideToggle',
    label: 'Fun',
    secondLabel: 'No Fun',
    value: 'No Fun', //must always match second label
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'N/A, right?',
    type: 'toggle',
    order: 1,
    submitAfterThisQuestion: true
  });
  private testSlideToggleQuestion: SlideToggleQuestion = new SlideToggleQuestion({
    key: 'testSlideToggle',
    label: 'Gay',
    secondLabel: 'Straight',
    value: 'Straight', //must always match second label
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'N/A, right?',
    type: 'toggle',
    order: 1,
    submitAfterThisQuestion: false
  });

  private collectionNameQuestion: TextQuestion = new TextQuestion({
    key: 'collectionName',
    label: 'Collection Name',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'E.g., Pyrenean Ibex Behavior Videos or Biology 101 Course Videos',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false
  });
  private categoryNameQuestion: TextQuestion = new TextQuestion({
    key: 'categoryName',
    label: 'Category Name',
    groupLabel: 'Category',
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: false,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'E.g., Mating Behavior or Chapter Section',
    type: 'text',
    order: 2,
    submitAfterThisQuestion: false
  });
  private collectionItemQuestion: TextQuestion = new TextQuestion({
    key: 'itemName',
    label: 'Item Name',
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: true,
    disableAddButtonIfCurrentValueIsBlank: true,
    disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: true,
    isThisQuestionTheLastOfAQuestionGroup: true,
    indentThisQuestion: true,
    placeHolder: 'E.g., Mating display or Emergent Properties of Water',
    type: 'text',
    order: 3,
    submitAfterThisQuestion: true
  });
  private labelQuestion: TextQuestion = new TextQuestion({
    key: 'labelQuestionName',
    label: 'What label do you want to give your first question to your user?',
    groupLabel: "Question For Your Users",
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'E.g., Video URL (note that this question is required and will be automatically generated)',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false
  });
  private genericLabelQuestion: TextQuestion = new TextQuestion({
    key: 'genericLabelQuestionName',
    label: 'What label do you want to give your next question to your user?',
    groupLabel: "Question For Your Users",
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: false,
    isThisQuestionTheLastOfAQuestionGroup: false,
    indentThisQuestion: false,
    placeHolder: 'E.g., Video URL (note that this question is required and will be automatically generated)',
    type: 'text',
    order: 1,
    submitAfterThisQuestion: false
  });
  private inputTypeQuestion: DropdownQuestion = new DropdownQuestion({
    key: 'inputTypeQuestionName',
    label: 'What type of question do you want this question to be?',
    groupLabel: "Question For Your Users",
    value: '',
    required: true,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: true,
    isThisQuestionTheLastOfAQuestionGroup: true,
    disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: true,
    indentThisQuestion: false,
    type: 'dropdown',
    order: 2,
    dropdownOptions: [{key:'text', value:'Text'}, {key:'dropdown', value:'Dropdown'}, {key:'datepicker', value:'Date Picker'}, {key:'toggle', value:'Slide Toggle'}, {key:'autocomplete', value:'Autocomplete'}],
    submitAfterThisQuestion: true
  });
  private genericInputTypeQuestion: DropdownQuestion = new DropdownQuestion({
    key: 'inputTypeQuestionName',
    label: 'What type of question do you want this question to be?',
    groupLabel: "Question For Your Users",
    value: '',
    required: false,
    giveOptionToAnswerThisQuestionMultipleTimes: false,
    disableAddButtonIfCurrentValueIsBlank: true,
    pairThisQuestionWithPreviousQuestion: true,
    isThisQuestionTheLastOfAQuestionGroup: true,
    indentThisQuestion: true,
    type: 'dropdown',
    order: 2,
    dropdownOptions: [{key:'text', value:'Text'}, {key:'dropdown', value:'Dropdown'}, {key:'datepicker', value:'Date Picker'}, {key:'toggle', value:'Slide Toggle'}, {key:'autocomplete', value:'Autocomplete'}],
    submitAfterThisQuestion: true
  });

  getAccountCreationQuestions(){
    let accountCreationQuestions: FormQuestionBase<string>[] = [];
    accountCreationQuestions.push(this.userNameQuestion);
    accountCreationQuestions.push(this.emailAddressQuestion);
    accountCreationQuestions.push(this.passwordQuestion);
    accountCreationQuestions.push(this.confirmPasswordQuestion);
    accountCreationQuestions.push(this.gymAffiliationQuestion);
    accountCreationQuestions.push(this.genderQuestion);
    accountCreationQuestions.push(this.giRankQuestion);
    accountCreationQuestions.push(this.noGiRankQuestion);
    accountCreationQuestions.push(this.weightQuestion);
    accountCreationQuestions.push(this.ageQuestion);
    return of(accountCreationQuestions);
  }

  getAccountCreationQuestionsAsObj(){
    let accountCreationQuestions: FormQuestionBase<string>[] = [];
    accountCreationQuestions.push(this.userNameQuestion);
    accountCreationQuestions.push(this.emailAddressQuestion);
    accountCreationQuestions.push(this.passwordQuestion);
    accountCreationQuestions.push(this.confirmPasswordQuestion);
    accountCreationQuestions.push(this.gymAffiliationQuestion);
    accountCreationQuestions.push(this.genderQuestion);
    accountCreationQuestions.push(this.giRankQuestion);
    accountCreationQuestions.push(this.noGiRankQuestion);
    accountCreationQuestions.push(this.weightQuestion);
    accountCreationQuestions.push(this.ageQuestion);
    return accountCreationQuestions;
  }

  getPasswordQuestionAsObj(){
    let passwordQuestion: FormQuestionBase<string>[] = [];
    passwordQuestion.push(this.passwordTextTestQuestion);
    return passwordQuestion;
  }

  getShamQuestionAsObj(){
    let shameQuestion: FormQuestionBase<string>[] = [];
    shameQuestion.push(this.shamQuestion);
    return shameQuestion;
  }

  getTestQuestions(){
    let testQuestions: FormQuestionBase<string>[] = [];
    testQuestions.push(this.genderQuestion);
    // testQuestions.push(this.passwordTextTestQuestion);
    // testQuestions.push(this.testIndividualOneEditQuestion);
    // testQuestions.push(this.testIndividualTwoEditQuestion);
    // testQuestions.push(this.testSlideToggleQuestion);
    // testQuestions.push(this.secondTestSlideToggle);
    return of(testQuestions);
  }

  getNewCollectionQuestions(){
    let newCollectionQuestions: FormQuestionBase<string>[] = [];
    newCollectionQuestions.push(this.collectionNameQuestion);
    newCollectionQuestions.push(this.categoryNameQuestion);
    newCollectionQuestions.push(this.collectionItemQuestion);
    return of(newCollectionQuestions);
  }

  getNewCollectionQuestionsAsObj(){
    let newCollectionQuestions: FormQuestionBase<string>[] = [];
    newCollectionQuestions.push(this.collectionNameQuestion);
    newCollectionQuestions.push(this.categoryNameQuestion);
    newCollectionQuestions.push(this.collectionItemQuestion);
    return newCollectionQuestions;
  }

  getShamCollectionQuestionsInstantly(){
    let newCollectionQuestions: FormQuestionBase<string>[] = [];
    newCollectionQuestions.push(this.collectionNameQuestion);
    newCollectionQuestions.push(this.categoryNameQuestion);
    newCollectionQuestions.push(this.collectionItemQuestion);
    return newCollectionQuestions;
  }

  getCollectionQuestionGroupQuestions(){
    let collectionQuestionGroupQuestions: FormQuestionBase<string>[] = [];
    collectionQuestionGroupQuestions.push(this.categoryNameQuestion);
    collectionQuestionGroupQuestions.push(this.collectionItemQuestion);
    return of(collectionQuestionGroupQuestions);
  }

  getOriginalCollectionOwnerQuestionGroupQuestions(){
    let entryDetailQuestions: FormQuestionBase<string>[] = [];
    entryDetailQuestions.push(this.labelQuestion);
    entryDetailQuestions.push(this.inputTypeQuestion);
    return of(entryDetailQuestions);
  }

  getIndividualOneEditQuestion(){
    // console.log("getIndividualOneEditQuestion entered");
    let individualOneQuestionArray: FormQuestionBase<string>[] = [];
    individualOneQuestionArray.push(this.individualOneEditQuestion);
    // console.log("getIndividualOneEditQuestion exiting...");
    return of(individualOneQuestionArray);
  }

  getIndividualOneEditQuestionAsObj(){
    let individualOneQuestionArray: FormQuestionBase<string>[] = [];
    individualOneQuestionArray.push(this.individualOneEditQuestion);
    return individualOneQuestionArray;
  }

  getIndividualTwoEditQuestion(){
    // console.log("getIndividualTwoEditQuestion entered");
    let individualTwoQuestionArray: FormQuestionBase<string>[] = [];
    individualTwoQuestionArray.push(this.individualTwoEditQuestion);
    // console.log("getIndividualTwoEditQuestion exiting...");
    return of(individualTwoQuestionArray);
  }

  getIndividualTwoEditQuestionAsObj(){
    let individualTwoQuestionArray: FormQuestionBase<string>[] = [];
    individualTwoQuestionArray.push(this.individualTwoEditQuestion);
    return individualTwoQuestionArray;
  }

  getEditAgeClassQuestion(){
    let ageClassQuestionArray: FormQuestionBase<string>[] = [];
    ageClassQuestionArray.push(this.ageClassEditQuestion);
    return of(ageClassQuestionArray);
  }

  getEditWeightQuestion(){
    let weightClassQuestionArray: FormQuestionBase<string>[] = [];
    weightClassQuestionArray.push(this.weightClassEditQuestion);
    return of(weightClassQuestionArray);
  }

  getEditGiNogiQuestion(){
    let giNogiQuestionArray: FormQuestionBase<string>[] = [];
    giNogiQuestionArray.push(this.giNogiEditQuestion);
    return of(giNogiQuestionArray);
  }

  getEditTournamentNameQuestion(){
    let tournamentNameQuestionArray: FormQuestionBase<string>[] = [];
    tournamentNameQuestionArray.push(this.tournamentNameEditQuestion);
    return of(tournamentNameQuestionArray);
  }

  getEditDateQuestion(){
    let dateQuestionArray: FormQuestionBase<string>[] = [];
    dateQuestionArray.push(this.dateEditQuestion);
    return of(dateQuestionArray);
  }

  getEditLocationQuestion(){
    let locationQuestionArray: FormQuestionBase<string>[] = [];
    locationQuestionArray.push(this.locationEditQuestion);
    return of(locationQuestionArray);
  }

  getEditRankQuestion(){
    let rankQuestionArray: FormQuestionBase<string>[] = [];
    rankQuestionArray.push(this.rankEditQuestion);
    return of(rankQuestionArray);
  }

  getNewEntryDetailQuestions(){
    let entryDetailQuestions: FormQuestionBase<string>[] = [];
    entryDetailQuestions.push(this.genericLabelQuestion);
    entryDetailQuestions.push(this.genericInputTypeQuestion);
    return of(entryDetailQuestions);
  }

  questionsFromDbCollection(collection: Collection): Observable<any>{
    let collectionDbQuestions: FormQuestionBase<string>[] = [];
    // console.log("collection from questionsFromDbCollection is:");
    // console.log(collection);
    let ownerQuestions: OwnerQuestion[] = collection.getOwnerQuestions();
    if(ownerQuestions){
      // console.log("ownerQuestions.length is " + ownerQuestions.length);
      for(let i=0; i<ownerQuestions.length; i++){
        let currentOwnerQuestion: any = ownerQuestions[i]; //still json somehow
        // console.log("currentOwnerQuestion is: ");
        // console.log(currentOwnerQuestion.question);
        let questionContent: any = {
          key: 'ownerQuestion' + i,
          label: currentOwnerQuestion.question,
          value: '',
          required: currentOwnerQuestion.question==="Video URL"? true:false,
          giveOptionToAnswerThisQuestionMultipleTimes: false,
          disableAddButtonIfCurrentValueIsBlank: false,
          groupLabel: 'Questions about the video',
          disableAddNewQuestionGroupButtonIfCurrentValueIsBlank: true,
          pairThisQuestionWithPreviousQuestion: currentOwnerQuestion.type === "Dropdown"? true:false,
          isThisQuestionTheLastOfAQuestionGroup: false, //i<ownerQuestions.length-1 ? false:true,
          indentThisQuestion: false,
          placeHolder: '',
          smallSize: 12,
          mediumSize: 6,
          largeSize: 6,
          // order: 1,
          controlType: currentOwnerQuestion.questionType,
          type: currentOwnerQuestion.questionType,
          submitAfterThisQuestion: i<ownerQuestions.length-1 ? false:true,
          dropdownOptions: []
        };
        let currentQuestion: FormQuestionBase<string> = null; //TODO could this and the below branching benefit from abstract factory pattern? Once I grok that, revisit this
        if(questionContent.type && questionContent.type === "Text"){
          currentQuestion = new TextQuestion(questionContent);
        }
        if(questionContent.type && questionContent.type === "Dropdown"){
          currentQuestion = new DropdownQuestion(questionContent); //TODO dropdown question needs a "enableOptionToAddNewOptions" and then a name for the node on firebase to add candidates to
        }
        if(questionContent.type && questionContent.type === "Date Picker"){
          currentQuestion = new DatePickerQuestion(questionContent);
        }
        if(questionContent.type && questionContent.type === "Date Picker"){
          currentQuestion = new AutocompleteQuestion(questionContent);
        }
        if(currentQuestion){
          collectionDbQuestions.push(currentQuestion);
        }
      }
      return of(collectionDbQuestions);
    } else{
      return of(null);
    }
  }

}
