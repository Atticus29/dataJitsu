export class Collection {
  // private annotationRating: number;
  // constructor(public tournamentName: string, public location: string, public date: string, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
  constructor() {
   }

   static fromJson ({}): Collection{ //TODO
     // console.log("got to mapping attempt")
     return new Collection(); //TODO
   }
}
