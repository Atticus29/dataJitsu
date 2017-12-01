export class user {
  constructor(public name: string, public email: string, public rank: string, public affiliation: string, public age: number, public weight: number, public weightClass: string) { }

  private boolean isValidWeight(weight: number){
    return (number<8 || number > 1400);
  }
}
