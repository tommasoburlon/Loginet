class queue_element{
  constructor(val){
    this.value = val;
    this.next = undefined;
    this.prev = undefined;
  }
}

class queue{
  constructor(){
    this.head = undefined;
    this.tail = undefined;
    this.length = 0;
  }

  push(val){
    if(!this.head){
      this.head = new queue_element(val);
      this.tail = this.head;
    }else{
      this.tail.next = new queue_element(val);
      this.tail.next.prev = this.tail;
      this.tail = this.tail.next;
    }
    this.length++;
  }

  pop(){
    let res = this.head ? this.head.value : null;
    if(this.head){
      this.head = this.head.next;
      if(this.head)
        this.head.prev = undefined;
    }
    this.length--;
    return res;
  }

  top(){ return this.head ? this.head.value : null; }

  empty(){ return this.length == 0; }

  size(){ return this.length; }
}
