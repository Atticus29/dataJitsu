export class Collection {
  private details: Object;
  // constructor(public tournamentName: string, public location: string, public date: string, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
  constructor(private name: string) {
   }

   static fromJson (jsonObj: any): Collection{
     let detailObj = {};
     let jsonObjKeys = Object.keys(jsonObj);
     let jsonObjVals = Object.values(jsonObj);
     for(let i = 0; i<jsonObjKeys.length; i++){
       let parentString = jsonObjKeys[i].split(/\d+/)[0] + 's';
       if(parentString !== 'collectionNames'){
          detailObj[parentString] ? detailObj[parentString].push(jsonObjVals[i]): detailObj[parentString]=[jsonObjVals[i]];
          detailObj[parentString] = detailObj[parentString].sort();
       }
     }
     // console.log(detailObj);
     let name = jsonObj.collectionName;
     let newCollection = new Collection(name);
     newCollection.addDetails(detailObj);
     return newCollection;
   }

   addDetails(detailsObj: Object){
     this.details= detailsObj;
   }
}
