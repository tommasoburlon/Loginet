
class NumericalRange{
  constructor(start, end){
    this.start = start;
    this.end = end;
  }
  contains(value){
    return this.start <= value && this.end >= value;
  }
}
