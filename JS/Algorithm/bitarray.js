class bitarray{
  constructor(_size = 1){
    this.value = 0n;
    this.size = BigInt(_size);
  }

  set(idx){
    let mask = (1n << BigInt(idx));
    this.value |= mask;
  }

  setBit(idx, val){
    if(val)
      this.set(idx);
    else
      this.reset(idx);
  }

  invert(idx){
    if(this.get(idx))
      this.reset(idx);
    else
      this.set(idx);
  }

  reset(idx){
    let mask = ((1n << (this.size)) - 1n) - (1n << BigInt(idx));
    this.value &= mask;
  }

  get(idx){
    return ((this.value & (1n << (BigInt(idx)))) == 0) ? 0 : 1;
  }

  append(arr){
    let res = new bitarray();
    res.value = (this.value << this.size) + arr.value;
    return res;
  }

  toString(){
    let str = "";
    for(let i = this.size - 1n; i >= 0n; i--)
      str += this.get(i);
    return str;
  }

  clone(){
    let ret = new bitarray(this.size);
    ret.value = this.value;
    return ret;
  }
}
