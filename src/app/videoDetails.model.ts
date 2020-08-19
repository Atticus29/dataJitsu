export class VideoDetails {
  private annotationRating: number;
  private videoRating: number;
  private flaggedAsMissing: boolean;
  private flaggedAsInappropriate: boolean;
  constructor(public tournamentName: string, public location: string, public date: string, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
    this.annotationRating = 0;
    this.videoRating = 0;
    this.flaggedAsMissing = false;
    this.flaggedAsInappropriate = false;
   }

   static fromJson ({ageClass, annotationRating, athlete1Name, athlete2Name, date, flaggedAsInappropriate, flaggedAsMissing, gender, giStatus, location, videoRating, rank, tournamentName, videoUrl, weightClass}): VideoDetails{
     // console.log("got to mapping attempt")
     return new VideoDetails(tournamentName, location, date, athlete1Name, athlete2Name, weightClass, rank, videoUrl, gender, giStatus, ageClass);
   }
}
