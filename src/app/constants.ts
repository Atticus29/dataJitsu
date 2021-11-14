import { ApprovalConfig } from "./approvalConfig.model";

export var constants = {
  eventNamesThatAreDelimiters: ["Match Start", "Match End"],
  genders: [
    "Female",
    "Male",
    "Mixed",
    "Non-binary",
    "Trans Female",
    "Trans Male",
    "Other",
  ],
  genderDropdownOptions: [
    { key: "Female", value: "Female" },
    { key: "Male", value: "Male" },
    { key: "Non-binary", value: "Non-binary" },
    { key: "Trans Female", value: "Trans Female" },
    { key: "Trans Male", value: "Trans Male" },
    { key: "Other", value: "Other" },
  ],
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
  locationRemovedMessage: "Location_name_has_been_removed", //must remain camel case for current tests to pass
  affiliationRemovedMessage: "Gym affiliation has been removed",
  collectionAddedNotification: "Your collection has been added",
  collectionOwnerQuestionsAddedNotification:
    "Your questions have been added to your collection. Users who use your collection will be prompted with those questions when adding videos",
  videoDeetUpdatedNotification:
    "Your video detail has been updated successfully",
  userDetailUpdatedNotification:
    "Your user detail has been updated successfully",
  videoDeetUpdateFailureNotification:
    "Your video detail did not update successfully",
  userDetailUpdateFailureNotification:
    "Your user detail did not update successfully",
  userAddedToDbNotification: "User successfully created!",
  userAddedToDbFailureNotification: "User NOT successfully created",
  collectionAlreadyExistsNotification:
    "Collection already exists in the database. Please choose a new name or category-item combination.",
  collectionOwnerQuestionsErrorNotification:
    "Unable to add questions to your collection",
  eventNameAlreadyExistsNotification:
    "Move already exists in the database. Please find it in the dropdown menu",
  videoAddedNotification: "Video has been added successfully",
  videoAddFailureNotification: "Error: Video was not successfully added",
  numDaysBeforeNewAnnotationNeeded: 30,
  numberOfCurrentAnnotationsNeeded: 6,
  numberOfSecondsToleratedToBeCalledSameAnnotation: 3,
  defaultVideoUrlCode: "OXcM9hE5wUk",
  temp: "hi, Mark",
  monthlyCost: 1.5,
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
    "Take Downs or Take Down Attempts",
  ],
  rootNodesWithSubcategories: ["Submissions or Submission Attempts"],
  subCategories: [
    "Choke Or Cervical Submissions",
    "Elbow",
    "Shoulder",
    "Knee Ligaments",
    "Back",
    "Ankle Ligaments",
    "Groin",
    "Wrist",
    "Verbal Tap",
  ],
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
    10: 10000,
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
  numberOfPointsToAwardForApprovingGymAffiliation: 5,
  minimumAnnotationRatingThatAVideoFlaggedAsRemovedNeedsToPreventMajorityAnnotatorDeduction: 3.5,
  numberOfFlagsAnAnnotationNeedsBeforeItIsDisplayedToDrawAttention: 1,
  numberOfPointsToAwardForBeingMajorityAnnotatorOfAGoodAnnotationRating: 10,
  numberOfStarsForAnAnnotationRatingToBeConsideredStrong: 4,
  stipePlanId: "plan_GQ7IoLADxXFFak", // TODO move this??
  get weightClassApprovalConfig() {
    return new ApprovalConfig(
      null,
      null,
      "Weight class",
      "weight class",
      this.weightClassRemovedMessage,
      this.numberOfPointsToAwardForApprovingWeigthClassName,
      "videoDeets/weightClass",
      "/weightClasses",
      "/candidateWeightClasses"
    );
  },
  get tournamentNameApprovalConfig() {
    return new ApprovalConfig(
      null,
      null,
      "Tournament name",
      "tournament",
      this.tournamentNameRemovedMessage,
      this.numberOfPointsToAwardForApprovingTournamentName,
      "videoDeets/tournamentName",
      "/tournamentNames",
      "/candidateTournamentNames"
    );
  },
  get noGiRankApprovalConfig() {
    return new ApprovalConfig(
      null,
      null,
      "No gi rank name",
      "no gi rank",
      this.noGiRankNameRemovedMessage,
      this.numberOfPointsToAwardForApprovingNoGiRankName,
      "videoDeets/rank",
      "/noGiRanks",
      "/candidateNoGiRanks"
    );
  },
  get ageClassApprovalConfig() {
    return new ApprovalConfig(
      null,
      null,
      "Age class name",
      "age class",
      this.ageClassRemovedMessage,
      this.numberOfPointsToAwardForApprovingAgeClass,
      "videoDeets/ageClass",
      "/ageClasses",
      "/candidateAgeClasses"
    );
  },
  get locationNameApprovalConfig() {
    return new ApprovalConfig(
      null,
      null,
      "Location name",
      "location",
      this.locationRemovedMessage,
      this.numberOfPointsToAwardForApprovingLocation,
      "videoDeets/location",
      "/locations",
      "/candidateLocationNames"
    );
  },
  get gymAffiliationApprovalConfig() {
    return new ApprovalConfig(
      null,
      null,
      "Gym affiliation",
      "gym affiliation",
      this.affiliationRemovedMessage,
      this.numberOfPointsToAwardForApprovingGymAffiliation,
      "affiliation",
      "/gymAffiliations",
      "/candidateGymAffiliations"
    );
  },
  videoDetails: "videoDeets",
  affiliation: "affiliation",
  alreadyExistsNotification: "Your entry already exists in dropdown menu!",
  allVideosPathName: "all-videos",
  homePath: "",
  landingPath: "landing",
  userInfoPath: "user",
  collectionsPathName: "collections",
  individualPathName: "videos",
  newVideoPathName: "new-video",
  errorPathName: "error",
  collectionCreationPathName: "create-collection",
  annotationRecordedMessage: "Annotation Recorded",
  columnsToDisplay: [
    "rank",
    "weightClass",
    "ageClass",
    "athlete1Name",
    "athlete2Name",
    "gender",
    "tournamentName",
    "location",
    "date",
    "videoRating",
    "annotationRating",
    "annotationsInMatch",
    "videoUrl",
  ],
  datePickerPrompt: "Choose a date using the date picker below",
  collectionSpecificEventPhrase: "move or rank or weight class",
  get faqQuestions() {
    return [
      {
        question: "What is " + this.title + "?",
        answer:
          this.title +
          " is a tool to crowd-curate and perform data analysis on " +
          this.activityName +
          " videos. Users are able to submit videos for annotation and annotate videos themselves. Both videos and analytics will be sortable and filterable by various criteria, including annotations (i.e., by which moves are present in the video).",
      },
      {
        question: "Why can't I see all of the matches or  statistics?",
        answer:
          "It may be possible that you have either not earned enough reputation points or have recently had reputation points deducted for past actions",
      },
      {
        question: "How do I earn reputation points?",
        answer:
          "Users can make " +
          this.numberOfCurrentAnnotationsNeeded +
          " annotations on a video. All annotations earn a user " +
          this.numberOfPointsToAwardForAnnotation +
          " points. Reputation points expire on a monthly basis. Alternatively, users can purchase reputations points with a monthly subscription costing " +
          this.monthlyCost +
          ".",
      },
      {
        question: "Can I lose reputation points? How?",
        answer:
          "Yes, you can. Reputation points are lost in the following ways: \n 1. Annotations made by a user are flagged as incorrect by " +
          this.numberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction +
          " or more users. Such an event results in a loss of " +
          this.numberOfPointsToDeductForBadAnnotation +
          " reputation points \n 2. User creates a " +
          this.collectionSpecificEventPhrase +
          " name that is flagged by " +
          this.numberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction +
          " other users as inappropriate. \n 3. User posts a video that is flagged by " +
          this.numberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction +
          " other users as inappropriate. \n 4. User posts a video that is flagged as removed by " +
          this.numberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction +
          " other users before being rated with a " +
          this
            .minimumAnnotationRatingAVideoFlaggedAsRemovedNeedsToPreventUserDeduction +
          " or higher",
      },
    ];
  },
  noneEntered: "Individual starting on the left",
  noneEntered2: "Individual starting on the right",
  reputationLogLable: "Reputation Log",
  subscriptManageLabel: "Manage Subscription",
  subscriptionStatusLabel: "Your subscription status",
  collectionLabel: "Your Collections",
  userIdLabel: "You",
  noCollectionsYet: "You currently have no collections",
  nameOfIndividual1InDb: "athlete1Name",
  nameOfIndividual2InDb: "athlete2Name",
  nameOfVideoDetailsInDb: "videoDeets",
  nameOfEventsInDb: "events",
  nameOfEventUserFacing: "move",
  nameOfEventsUserFacingPlural: "moves",
  nameOfVideoInDb: "video",
  nameOfVideosInDbPlural: "videos",
  nameofVideoUserFacing: "match",
  nameofVideosUserFacingPlural: "matches",
  numOccurrences: "Number of Occurrences",
  editableUserInfoList: [
    "affiliation",
    "age",
    "gender",
    "giRank",
    "noGiRank",
    "weight",
    "name",
  ],
  displayableUserInfoObj: {
    name: "Name",
    dateCreated: "Date Created",
    dateLastAnnotated: "Date of Last Annotation",
    privileges: "Privileges",
    reputationPoints: "Reputation Points",
    affiliation: "Affiliation",
    age: "Age",
    email: "Email Address",
    gender: "Gender",
    giRank: "Gi Rank",
    noGiRank: "No Gi Rank",
    weight: "Weight (Kg)",
  },
  stringSharedByAllDateParams: "date",
  privilegesParamName: "privileges",
  displayablePrivilegesInfoObj: {
    canAnnotateVideos: "Can Annotate Videos",
    canEditMatches: "Can Edit Video Details",
    canFlagAnnotations: "Can Flag Annotations",
    canFlagUsers: "Can Flag Users",
    canRateAnnotations: "Can Rate Annotations",
    canRateMatches: "Can Rate Videos",
    isAdmin: "Is An Administrator",
  },
  noSaltAlert:
    "Your password is not salted! Please alert staff using the feedback button",
  filter: "Filter",
  toggleDataVisOnAllDisplayText: "Display Histogram",
};
