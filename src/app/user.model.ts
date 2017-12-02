export class user {
  constructor(public name: string, public email: string, public rank: string, public affiliation: string, public age: number, public weight: number, public weightClass: string) { }

  isValidWeight(): boolean{
    return (this.weight<8 || this.weight > 1400);
  }
}
