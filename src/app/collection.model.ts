export class Collection {
  private details: string[];
  // constructor(public tournamentName: string, public location: string, public date: string, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
  constructor(private name: string) {
   }

   static fromJson (jsonObj: any): Collection{ //TODO
     console.log("got to mapping attempt for collection");
     let name = jsonObj.name;
     return new Collection(name); //TODO
   }

   addDetail(newDetail: string){
     this.details.push(newDetail);
   }
}
