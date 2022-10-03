
class Event{
  constructor(message, port, sendTime, recvTime){
    this.sendTime = sendTime;
    this.recvTime = recvTime;
    this.message = message;
    this.port = port;
  }
}

class Environment{
  constructor(){
    this.queue = new heap((o1, o2) => {return o1.recvTime >= o2.recvTime});
    this.nodes = [];
    this.globalTime = 0;
  }

  send(port, msg, delay){
    if(!port.isLinked()) return;

    let recvPort = port.getLinked();
    this.sendToPort(recvPort, msg, delay);
  }

  sendToPort(port, msg, delay){
    this.queue.push(new Event(msg, port, this.globalTime, this.globalTime + delay));
    this.globalTime += 0.0001;
    port.onMessageSent(env, msg, this.globalTime + delay);
  }

  executeNext(){
    let res, n, idx, executed = false;
    do{
      res = this.queue.pop();
      if(res){
        res.port.onMessageArrived(env, res.message, res.sendTime);
        res.port.parent.receive(this, res.port, res.message);
        executed = true;
      }
    }while(!this.queue.empty() && !executed);
  }

  execute(){
    while(this.queue.top() && this.globalTime > this.queue.top().recvTime)
      this.executeNext();
  }

  insertNode(n){ this.nodes.push(n); n.start(this); }

  removeNode(n){
    let idx = this.nodes.indexOf(n);
    this.nodes[idx] = this.nodes[this.nodes.length - 1];
    this.nodes.pop();
  }

  reset(){
    this.globalTime = 0;
    this.queue.clear();
    for(let o of this.nodes){
      o.state = o.init(o.getParams());
      o.start(this);
    }
  }
}
