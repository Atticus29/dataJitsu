import { ApprovalConfig } from './approvalConfig.model';

export var constants = {
    eventNamesThatAreDelimiters: ["Match Start", "Match End"],
    genders: ["Female", "Male", "Mixed", "Non-binary", "Trans Female", "Trans Male", "Other"],
    title: "Video Annotator",
    activityName: "Brazilian jiu jitsu",
    minPwLength: 7,
    lightBlueHex: "#ADD8E6",
    athleteNameRemovedMessage: "Athlete name has been removed; flag me",
    eventNameRemovedMessage: "Move name has been removed; flag me",
    tournamentNameRemovedMessage: "Tournament name has been removed",
    noGiRankNameRemovedMessage: "No gi rank name has been removed; flag me",
    ageClassRemovedMessage: "Age class has been removed",
    weightClassRemovedMessage: "Weight class name has been removed",
    locationRemovedMessage: "Location_name_has_been_removed",
    collectionAddedNotification: "Your collection has been added",
    collectionAlreadyExistsNotification: "Collection already exists in the database. Please choose a new name or category-item combination.",
    eventNameAlreadyExistsNotification: "Move already exists in the database. Please find it in the dropdown menu",
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
    "Discliplinary Action",
    "Event Logistics",
    "Guard Passes or Guard Pass Attempts",
    "Positional Changes That Score Points In Most Rule Sets",
    "Positions With Names That Do Not Score Points In Most Rule Sets",
    "Submissions or Submission Attempts",
    "Sweeps or Sweep Attempts",
    "Take Downs or Take Down Attempts"
    ],
    rootNodesWithSubcategories: ["Submissions or Submission Attempts"],
    subCategories: ["Choke Or Cervical Submissions", "Elbow", "Shoulder", "Knee Ligaments", "Back", "Ankle Ligaments", "Groin", "Wrist", "Verbal Tap"],
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
    numberOfPointsToAwardForApprovingAgeClass: 5,
    numberOfPointsToAwardForApprovingLocation: 5,
    minimumAnnotationRatingThatAVideoFlaggedAsRemovedNeedsToPreventMajorityAnnotatorDeduction: 3.5,
    numberOfFlagsAnAnnotationNeedsBeforeItIsDisplayedToDrawAttention: 1,
    numberOfPointsToAwardForBeingMajorityAnnotatorOfAGoodAnnotationRating: 10,
    numberOfStarsForAnAnnotationRatingToBeConsideredStrong: 4,
    stipePlanId: "plan_GQ7IoLADxXFFak",
    get weightClassApprovalConfig() {
      return new ApprovalConfig(null, null, 'Weight class', 'weight class', this.weightClassRemovedMessage, this.numberOfPointsToAwardForApprovingWeigthClassName, 'videoDeets/weightClass', '/weightClasses', '/candidateWeightClasses')
    },
    get tournamentNameApprovalConfig() {
      return new ApprovalConfig(null, null, 'Tournament name', 'tournament', this.tournamentNameRemovedMessage, this.numberOfPointsToAwardForApprovingTournamentName, 'videoDeets/tournamentName', '/tournamentNames', '/candidateTournamentNames')
    },
    get noGiRankApprovalConfig(){
      return new ApprovalConfig(null, null, "No gi rank name", "no gi rank", this.noGiRankNameRemovedMessage, this.numberOfPointsToAwardForApprovingNoGiRankName, 'videoDeets/rank', '/noGiRanks', '/candidateNoGiRanks')
    },
    get ageClassApprovalConfig(){
      return new ApprovalConfig(null, null, "Age class name", "age class", this.ageClassRemovedMessage, this.numberOfPointsToAwardForApprovingAgeClass, 'videoDeets/ageClass', '/ageClasses', '/candidateAgeClasses')
    },
    get locationNameApprovalConfig(){
      return new ApprovalConfig(null, null, "Location name", "location", this.locationRemovedMessage, this.numberOfPointsToAwardForApprovingLocation, 'videoDeets/location', '/locations', '/candidateLocationNames')
    },
    alreadyExistsNotification: "Your entry already exists in dropdown menu!",
    allVideosPathName: 'all-videos',
    individualPathName: 'videos',
    annotationRecordedMessage: "Annotation Recorded"
  };
