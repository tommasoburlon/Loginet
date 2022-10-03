//Logic part of the Node
class FIFONode extends Node{

  static metadata = {
    name: "FIFO Queue",
    path: "queue",
    desc: "first in first out queue",
    clone: () => new FIFOGNode(new FIFONode())
  };

  static metaparams = {
    size: new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(10)
      .setDomainFunction((p) => { return p.isInfinite ? Domain.Empty : Domain.Positive })
      .setName("queue size")
      .setDescription("dimension of the queue"),
    isInfinite: new Metaparam()
      .setType(Metaparam.type.BOOLEAN)
      .setDefault(false)
      .setDomainFunction(() => new FiniteDomain([true, false]))
      .setName("infinite queue")
      .setDescription("set to implement an infinite size queue"),
    isDeterministic: new Metaparam()
      .setType(Metaparam.type.BOOLEAN)
      .setDefault(true)
      .setDomainFunction(() => new FiniteDomain([true, false]))
      .setName("deterministic queue")
      .setDescription("set to implement a deterministic queue"),
    mean: new Metaparam()
      .setType(Metaparam.type.FLOAT)
      .setDefault(1000)
      .setDomainFunction((p) => { return p.isDeterministic ? Domain.Empty : Domain.Positive })
      .setName("average value")
      .setDescription("average value of the nagetive exp distribution")
  };

  constructor(){ super() }

  getDelay(params){ return -Math.log(1 - Math.random()) * params.mean; }

  /* implmentation abstract methods from Node class */
  getNumberPort(params){ return params.isDeterministic ? 3 : 2; }
  onStart(env, state, params){
    if(!params.isDeterministic) env.send(this.loopback, {}, this.getDelay(params));
  }
  onReceive(env, state, params, port, message){
    if(port.id == -1 || port.id == 2){
      if(!state.queue.empty()){
        env.send(this.ports[1], state.queue.top(), 0);
        state.queue.pop();
      }
      if(!params.isDeterministic)
        env.send(this.loopback, {}, this.getDelay(params));
    }else{
      if(params.isInfinite || params.size > state.queue.size())
        state.queue.push(message);
    }
    return state;
  }
  initState(params){ return {queue: new queue()}; }
  onPortConnect(port){}
  onPortDisconnect(port){}
}

class FIFOGNode extends DefaultGNode{
  constructor(node){ super(node); }

  /* implmentation abstract methods from GNode class */
  onParamChange(params){ this.size = new vec2(200, 100); this.ratio = 0.75; }

  getPinPosition(idx, params){
    if(idx == 0) return new vec2(0, this.size.y * 0.5);
    if(idx == 1) return new vec2(this.size.x, this.size.y * 0.5);
    if(idx == 2) return new vec2(this.size.x - 0.5 * (1 - this.ratio) * this.size.x, 0.5 * this.size.y + 0.5 * (1 - this.ratio) * this.size.x)
  }

  getPinLabel(idx, params){
    if(idx == 0) return "in";
    if(idx == 1) return "out";
    if(idx == 2) return "sig";
  }

  getPinLabelLocation(idx, params){
    if(idx == 0) return [-1, 1];
    if(idx == 1) return [1, 1];
    if(idx == 2) return [1, -1]
  }

  draw(cnv, ctx, state, params){
    ctx.fillStyle = "rgb(230, 230, 230)";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    
    let ratio = this.ratio;

    ctx.beginPath();
    ctx.rect(0, 0, ratio * this.size.x, this.size.y);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0.5 * (1 + ratio) * this.size.x, 0.5 * this.size.y, 0.5 * (1 - ratio) * this.size.x, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = Math.floor(0.8 * (1 - ratio) * this.size.x) + "px Courier New";
    let txtSize = ctx.measureText("\u{03BB}");
    ctx.fillText("\u{03BB}", 0.5 * (1 + ratio) * this.size.x - txtSize.width * 0.5, 0.5 * this.size.y + 0.3 * (1 - ratio) * this.size.x);

    if(!params.isInfinite){
      ctx.fillStyle = "yellow";
      ctx.fillRect(ratio * this.size.x, 0, -(state.queue.size() / params.size) * ratio * this.size.x, this.size.y);

      let cols = 6;
      for(let i = 1; i < cols; i++){
        ctx.beginPath();
        ctx.moveTo(Math.floor((i / cols) * ratio * this.size.x), 0);
        ctx.lineTo(Math.floor((i / cols) * ratio * this.size.x), this.size.y);
        ctx.stroke();
      }
    }else{
      ctx.font = Math.floor(this.size.y) + "px Courier New";
      let txtSize = ctx.measureText("\u{221E}");
      ctx.fillText("\u{221E}", 0.5 * ratio * this.size.x - 0.5 * txtSize.width, 0.75 * this.size.y);
    }
  }
}
