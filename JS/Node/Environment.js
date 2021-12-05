
class Event{
  constructor(_packet, _link, _direction, _time = 0){
    this.time = _time;
    this.packet = _packet;
    this.link = _link;
    this.direction = _direction;
  }
}

class Environment{
  constructor(){
    this.queue = new heap((o1, o2) => {return o1.time > o2.time});
    this.nodes = [];
    this.globalTime = 0;
  }

  sendPacket(node, gateIdx, packet, time){
    let nodeTo = node.getLinkedNode(gateIdx);
    if(nodeTo)
      this.queue.push(new Event(packet, node.links[gateIdx], node.links[gateIdx].n1 == node ? 1 : -1, this.globalTime + time));
    if(gateIdx == -1)
      this.queue.push(new Event(packet, node.loopback, 1, this.globalTime + time))
  }

  executeNext(){
    let res, n, idx;
    do{
      res = this.queue.pop();
      if(res && res.link && res.link.exist){
        n =   res.direction == 1 ? res.link.n2 : res.link.n1;
        idx = res.direction == 1 ? res.link.idx2 : res.link.idx1;
        n.update(idx, res.packet);
      }
    }while(!this.queue.empty() && (!res || !res.link || !res.link.exist));
  }

  execute(){
    while(this.queue.top() && this.globalTime > this.queue.top().time)
      this.executeNext();
  }

  insertNode(n){
    this.nodes.push(n);
  }

  removeNode(n){
    let idx = this.nodes.indexOf(n);
    this.nodes[idx] = this.nodes[this.nodes.length - 1];
    this.nodes.pop();
  }

  reset(){
    this.globalTime = 0;
    this.queue.clear();
    for(let o of this.nodes)
      o.init();
  }
}
