class Domain{
  static Empty;
  constructor(){}
  contains(value){}
  len(){}
  iter(){}
}

class FiniteDomain extends Domain{
  constructor(elements){ super(); this.elements = elements; }
  contains(value){
    for(let i in this.elements)
      if(this.elements[i] == value)
        return true;
    return false;
  }
  len(){ return this.elements.length; }
  iter(){ return this.elements; }
}

class NumericalDomain extends Domain{
    constructor(){ super(); this.ranges = []; }

    insertRange(range){ this.ranges.push(range); return this; }
    contains(value){
      for(let r of this.ranges){
        console.log(r);
        if(r.contains(value)) return true;
      }
      return false;
    }
    len(){ return Infinity; }
    iter(){ return this.ranges; }
}

Domain.Empty = new FiniteDomain([]);
Domain.Any = { contains: (val) => true, len: (() => Infinity), itr: (() => null) };
Domain.Positive = new NumericalDomain().insertRange(new NumericalRange(1, Infinity));
