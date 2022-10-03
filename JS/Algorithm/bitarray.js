class bitarray{
  constructor(size = 1){
    this.cell = 32 / 8;
    this.size = size;
    this.value = new Uint32Array(Math.ceil(size / this.cell));
    for(let i = 0; i < this.value.length; i++)
      this.value[i] = 0;
  }

  set(idx){
    this.value[Math.floor(idx / this.cell)] |= (1 << (idx % this.cell));
  }

  unset(idx){
    this.value[Math.floor(idx / this.cell)] &= ~(1 << (idx % this.cell));
  }

  setBit(idx, val){
    if(val)
      this.set(idx);
    else
      this.unset(idx);
  }

  invert(idx){
    if(this.get(idx))
      this.unset(idx);
    else
      this.set(idx);
  }

  get(idx){
    return (this.value[Math.floor(idx / this.cell)] & (1 << (idx % this.cell))) != 0;
  }

  slice(offset, size){
    let ret = new bitarray(size);
    for(let i = 0; i < size; i++)
      ret.setBit(i, this.get(i + offset))
    return ret;
  }

  toString(){
    let str = "";
    for(let i = 0; i < this.size; i++)
      str += this.get(i) ? '1' : '0';
    return str;
  }

  clone(){
    let ret = new bitarray(this.size);
    for(let i = 0; i < this.size; i++)
      ret.value[i] = this.value[i];
    return ret;
  }

  swap(array){
    let temp = array.value;
    array.value = this.value;
    this.value = temp;

    temp = array.size;
    array.size = this.size;
    this.size = temp;

  }

  copy(bits, offset = 0, size = -1){
    size = (size == - 1) ? Math.min(this.size - offset, bits.size) : size;
    for(let i = 0; i < size; i++){
      this.setBit(i + offset, bits.get(i));
    }
  }

  equals(bits, offset = 0, size = -1){
    size = (size == -1) ? Math.min(bits.size, this.size - offset) : size;

    if(size > this.size - offset || size > bits.size) return false;
    for(let i = 0; i < size; i++){
      if(bits.get(i) != this.get(i + offset)) return false;
    }
    return true;
  }


}
