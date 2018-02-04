export class MatchDetails {
  private annotationRating: number;
  private matchRating: number;
  constructor(public tournamentName: string, public location: string, public date: any, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
    this.annotationRating = 0;
    this.matchRating = 0;
   }
}
