export class Collection {
  private details: Object[];
  // constructor(public tournamentName: string, public location: string, public date: string, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
  constructor(private name: string) {
   }

   static fromJson (jsonObj: any): Collection{
     // console.log("got to mapping attempt for collection");
     // console.log(jsonObj);
     // console.log(Object.keys(jsonObj));
     // console.log(Object.values(jsonObj));
     let detailObj = {};
     let jsonObjKeys = Object.keys(jsonObj);
     let jsonObjVals = Object.values(jsonObj);
     for(let i = 0; i<jsonObjKeys.length; i++){
       let parentString = jsonObjKeys[i].split(/\d+/)[0] + 's';
       if(parentString !=== 'collectionNames'){
          detailObj[parentString] ? detailObj[parentString].push(jsonObjVals[i]): detailObj[parentString]=[jsonObjVals[i]];
       }
       // console.log(parentString);
       // if(detailObj[parentString + 's']){
       //   detailObj[parentString + 's'].push(jsonObjVals[i]);
       // } else{
       //   let tmpArray = [jsonObjVals[i]];
       //   detailObj[parentString + 's'] = tmpArray;
       // }
       // detailObj[parentString + 's'] = jsonObjVals[i];

       // console.log(detailObj[parentString]);
       // let childrenStrings = jsonObjKeys[i].split(/\d+/);
       // let childStringJoined = childrenStrings.slice(1,childrenStrings.length).join('');
       // console.log(childStringJoined);
     }
     console.log(detailObj);
     let name = jsonObj.collectionName;
     return new Collection(name); //TODO
   }

   addDetails(newDetailKey: string, newDetailValues: string[]){
     this.details[newDetailKey + 's']= newDetailValues;
     console.log(this.details);
   }
}
