import { ApprovalConfig } from './approvalConfig.model';

export var constants = {
    moveNamesThatAreDelimiters: ["Match Start", "Match End"],
    genders: ["Female", "Male", "Mixed", "Non-binary", "Trans Female", "Trans Male", "Other"],
    title: "Match Annotator",
    activityName: "Brazilian jiu jitsu",
    minPwLength: 7,
    lightBlueHex: "#ADD8E6",
    athleteNameRemovedMessage: "Athlete name has been removed; flag me",
    moveNameRemovedMessage: "Move name has been removed; flag me",
    tournamentNameRemovedMessage: "Tournament name has been removed",
    noGiRankNameRemovedMessage: "No gi rank name has been removed; flag me",
    weightClassRemovedMessage: "Weight class name has been removed",
    moveNameAlreadyExistsNotification: "Move already exists in the database. Please find it in the dropdown menu",
    numDaysBeforeNewAnnotationNeeded: 30,
    numberOfCurrentAnnotationsNeeded: 6,
    numberOfSecondsToleratedToBeCalledSameAnnotation: 3,
    defaultVideoUrlCode: "OXcM9hE5wUk",
    temp: "hi, Mark",
    monthlyCost: 1.50,
    monthlyCostString: "$1.50",
    halfYearCost: 6,
    yearlyCost: 10,
    requiredAnnotationsPerMonth: 1,
    rootNodes: [
    "Advantage",
    "Match Logistics",
    "Guard Passes or Guard Pass Attempts",
    "Take Downs or Take Down Attempts",
    "Submissions or Submission Attempts",
    "Sweeps or Sweep Attempts",
    "Positional Changes That Score Points In Most Rule Sets",
    "Positions With Names That Do Not Score Points In Most Rule Sets",
    "Discliplinary Action"
    ],
    rootNodesWithSubcategories: ["Submissions or Submission Attempts"],
    subCategories: ["Choke Or Cervical Submissions", "Elbow", "Shoulder", "Knee Ligaments", "Back", "Ankle Ligaments", "Groin", "Wrist"],
    privilegeLevels: {
      1: 100,
      2: 200,
      3: 500,
      4: 1000,
      5: 1500,
      6: 2000,
      7: 3000,
      8: 4000,
      9: 5000,
      10: 10000
    },
    annotationVoteQuota: 10,
    numberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction: 3,
    numberOfPointsToDeductForBadAnnotation: 50,
    numberOfPointsToAwardForAnnotation: 10,
    numberOfPointsToAwardForApprovingCandidateAthleteName: 5,
    numberOfPointsToAwardForApprovingMoveName: 5,
    numberOfPointsToAwardForApprovingTournamentName: 5,
    numberOfPointsToAwardForApprovingWeigthClassName: 5,
    numberOfPointsToAwardForApprovingNoGiRankName: 5,
    minimumAnnotationRatingThatAVideoFlaggedAsRemovedNeedsToPreventMajorityAnnotatorDeduction: 3.5,
    numberOfFlagsAnAnnotationNeedsBeforeItIsDisplayedToDrawAttention: 1,
    numberOfPointsToAwardForBeingMajorityAnnotatorOfAGoodAnnotationRating: 10,
    numberOfStarsForAnAnnotationRatingToBeConsideredStrong: 4,
    stipePlanId: "plan_GQ7IoLADxXFFak",
    get weightClassApprovalConfig() {
      return new ApprovalConfig(null, null, 'Weight class', 'weight class', this.weightClassRemovedMessage, this.numberOfPointsToAwardForApprovingWeigthClassName, 'matchDeets/weightClass', '/weightClasses', '/candidateWeightClasses')
    },
    get tournamentNameApprovalConfig() {
      return new ApprovalConfig(null, null, 'Tournament name', 'tournament name', this.tournamentNameRemovedMessage, this.numberOfPointsToAwardForApprovingTournamentName, 'matchDeets/tournamentName', '/tournamentNames', '/candidateTournamentNames')
    },
    get noGiRankApprovalConfig(){
      return new ApprovalConfig(null, null, "No gi rank name", "no gi rank name", this.noGiRankNameRemovedMessage, this.numberOfPointsToAwardForApprovingNoGiRankName, 'matchDeets/rank', '/noGiRanks', '/candidateNoGiRanks')
    },
    alreadyExistsNotification: "Your entry already exists in dropdown menu!"
  };
