export class Collection {
  private details: Object;
  private id: string = "temp";
  // constructor(public tournamentName: string, public location: string, public date: string, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
  constructor(private name: string) {
   }

   static fromForm (jsonObj: any): Collection{
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

   static fromDataBase (jsonObj: any): Collection{
     // let detailObj = {};
     // let jsonObjKeys = Object.keys(jsonObj);
     // let jsonObjVals = Object.values(jsonObj);
     // for(let i = 0; i<jsonObjKeys.length; i++){
     //   let parentString = jsonObjKeys[i].split(/\d+/)[0];
     //   console.log(parentString);
     //   if(parentString !== 'names' && parentString !== 'ids'){
     //      detailObj[parentString] ? detailObj[parentString].push(jsonObjVals[i]): detailObj[parentString]=[jsonObjVals[i]];
     //      detailObj[parentString] = detailObj[parentString].sort();
     //   }
     // }
     // console.log(detailObj);
     let name = jsonObj.name;
     let newCollection = new Collection(name);
     newCollection.addDetails(jsonObj.details);
     newCollection.setId(jsonObj.id);
     return newCollection;
   }

   addDetails(detailsObj: Object){
     this.details= detailsObj;
   }

   setId(id: string){
     this.id = id;
   }
}
