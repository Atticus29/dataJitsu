export class VideoDetails {
  private annotationRating: number;
  private videoRating: number;
  private flaggedAsMissing: boolean;
  private flaggedAsInappropriate: boolean;
  private tournamentName: string;
  private location: string;
  private date: string;
  private athlete1Name: string;
  private athlete2Name: string;
  private weightClass: string;
  private rank: string;
  private gender: string;
  private giStatus: boolean;
  private ageClass: string;
  private genericArgs: any;
  constructor(public videoUrl: string, optionalArgs: {
    tournamentName?: string;
    location?: string;
    date?: string;
    athlete1Name?: string;
    athlete2Name?: string;
    weightClass?: string;
    rank?: string;
    gender?: string;
    giStatus?: boolean;
    ageClass?: string;
    genericArgs?: any
  }) {
    this.annotationRating = 0;
    this.videoRating = 0;
    this.flaggedAsMissing = false;
    this.flaggedAsInappropriate = false;
    this.tournamentName = optionalArgs.tournamentName || '';
    this.location = optionalArgs.location || '';
    this.date = optionalArgs.date || '';
    this.athlete1Name = optionalArgs.athlete1Name || '';
    this.athlete2Name = optionalArgs.athlete2Name || '';
    this.weightClass = optionalArgs.weightClass || '';
    this.rank = optionalArgs.rank || '';
    this.gender = optionalArgs.gender || '';
    this.giStatus = optionalArgs.giStatus || null;
    this.ageClass = optionalArgs.ageClass || '';
    this.genericArgs = optionalArgs.genericArgs || null;
   }

   static fromForm (deetObj: any): VideoDetails{
     let {videoUrlBound, athlete1NameBound, athlete2NameBound, tournamentNameBound, locationBound, tournamentDateBound, rankBound, genderBound, ageClassBound, weightBound, giStatusBound, genericArgsBound} = deetObj;
     let videoDeetReturnObj = {};
     videoDeetReturnObj['tournamentName'] = tournamentNameBound?tournamentNameBound:'';
     videoDeetReturnObj['location'] = locationBound?locationBound:'';
     videoDeetReturnObj['date'] = tournamentDateBound?tournamentDateBound:'';
     videoDeetReturnObj['athlete1Name'] = athlete1NameBound?athlete1NameBound:'';
     videoDeetReturnObj['athlete2Name'] = athlete2NameBound?athlete2NameBound:'';
     videoDeetReturnObj['weightClass'] = weightBound?weightBound:'';
     videoDeetReturnObj['rank'] = rankBound?rankBound:'';
     videoDeetReturnObj['gender'] = genderBound?genderBound:'';
     videoDeetReturnObj['giStatus'] = giStatusBound?giStatusBound:'';
     videoDeetReturnObj['ageClass'] = ageClassBound?ageClassBound:'';
     videoDeetReturnObj['genericArgs'] = genericArgsBound? genericArgsBound: {};
     if(videoUrlBound){
       return new VideoDetails(videoUrlBound, videoDeetReturnObj);
     }else{
       return null;
     }
   }

   static fromJson (jsonObj:any): VideoDetails{
     // console.log("jsonObj in videoDetails fromJson:");
     // console.log(jsonObj);
     if(jsonObj.videoUrl){
       return new VideoDetails(jsonObj.videoUrl, jsonObj);
     }
     if(jsonObj.videoDeets && jsonObj.videoDeets.videoUrl){
       // console.log("got here c has videoUrl");
       return new VideoDetails(jsonObj.videoDeets.videoUrl, jsonObj.videoDeets);
     }
     if(jsonObj.ownerQuestion0){
       // console.log("got here d has ownerQuestion0");
       let argWrapper = {};
       argWrapper['genericArgs'] = jsonObj;
       return new VideoDetails(jsonObj.ownerQuestion0,argWrapper);
     }
   }

   getTournamentName(): string{
     return this.tournamentName;
   }
   getLocation(): string{
     return this.location;
   }
   getDate(): string{
     return this.date
   }
   getAthlete1Name(): string{
     return this.athlete1Name;
   }
   getAthlete2Name(): string{
     return this.athlete2Name;
   }
   getWeightClass(): string{
     return this.weightClass;
   }
   getRank(): string{
     return this.rank;
   }
   getGender(): string{
     return this.gender;
   }
   getGiStatus(): boolean{
     return this.giStatus;
   }
   getAgeClass(): string{
     return this.ageClass;
   }
   getGenericArgs(): any{
     return this.genericArgs;
   }
}
