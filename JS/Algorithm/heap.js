
class heap{
  constructor(_cmp = function(a, b){ return a > b; }){
    this.data = [];
    this.cmp = _cmp;
  }

  up(idx){
    let parent, currIdx, temp;

    currIdx = idx;
    parent = ((currIdx - 1) >> 1);

    while(currIdx > 0 && !this.cmp(this.data[currIdx], this.data[parent])){
      temp = this.data[currIdx];
      this.data[currIdx] = this.data[parent];
      this.data[parent] = temp;

      currIdx = parent;
      parent = ((currIdx - 1) >> 1);
    }
  }

  down(idx){
    let child1, child2, bestChild, temp, currIdx;

    currIdx = idx;
    child1 = (currIdx << 1) + 1;
    child2 = (currIdx << 1) + 2;
    bestChild = (child2 >= this.data.length || this.cmp(this.data[child2], this.data[child1])) ? child1 : child2;

    while(bestChild < this.data.length && !this.cmp(this.data[bestChild], this.data[currIdx])){
      temp = this.data[bestChild];
      this.data[bestChild] = this.data[currIdx];
      this.data[currIdx] = temp;

      currIdx = bestChild;
      child1 = (currIdx << 1) + 1;
      child2 = (currIdx << 1) + 2;
      bestChild = (child2 >= this.data.length || this.cmp(this.data[child2], this.data[child1])) ? child1 : child2;
    }
  }

  top(){ return this.data[0]; }

  push(val){
    this.data.push(val);
    this.up(this.data.length - 1);
  }

  pop(){
    let ret = this.top();
    this.data[0] = this.data[this.data.length - 1];
    this.data.pop();
    this.down(0);

    return ret;
  }

  empty(){
    return this.data.length == 0;
  }

  clear(){
    this.data = [];
  }
}
