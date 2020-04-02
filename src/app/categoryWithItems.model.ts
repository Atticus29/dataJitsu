export class CategoryWithItems {
  private id: string = "temp";
  // private categoryName: string;
  // constructor(public tournamentName: string, public location: string, public date: string, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
  constructor(private categoryName: string, private items: string[]) {
   }

   static fromForm (jsonObj: any): CategoryWithItems{
     //TODO
     // let detailObj = {};
     // let jsonObjKeys = Object.keys(jsonObj);
     // let jsonObjVals = Object.values(jsonObj);
     // for(let i = 0; i<jsonObjKeys.length; i++){
     //   let parentString = jsonObjKeys[i].split(/\d+/)[0] + 's';
     //   if(parentString !== 'collectionNames'){
     //      detailObj[parentString] ? detailObj[parentString].push(jsonObjVals[i]): detailObj[parentString]=[jsonObjVals[i]];
     //      detailObj[parentString] = detailObj[parentString].sort();
     //   }
     // }
     // // console.log(detailObj);
     // let name = jsonObj.collectionName;
     // let newCollection = new CategoryWithItems(name);
     // newCollection.addDetails(detailObj);
     // return newCollection;
   }

   static fromDataBase (jsonObj: any): CategoryWithItems{
     let name = jsonObj.name;
     let newCategoryWithItems = new CategoryWithItems(name, jsonObj.items);
     newCategoryWithItems.setId(jsonObj.id);
     return newCategoryWithItems;
   }

   addItems(newItems: string[]){
     this.items = this.items.concat(newItems);
   }

   setId(id: string){
     this.id = id;
   }
}
