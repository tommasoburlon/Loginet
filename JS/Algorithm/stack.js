class stack{
  constructor(){
    this.data = [];
  }

  push(val){
    this.data.push(val);
  }

  pop(){
    this.data.pop();
  }

  top(){
    return this.data[this.data.length - 1];
  }

  size(){ return this.data.length; }

  empty(){ return !this.data.length; }
}
