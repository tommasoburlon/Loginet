//Logic part of the Node
class LIFONode extends Node{

  static metadata = {
    name: "LIFO Queue",
    path: "queue",
    desc: "last in first out queue",
    clone: () => new LIFOGNode(new LIFONode())
  };

  static metaparams = {
    size: new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(10)
      .setDomainFunction(() => Domain.ANY)
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
    lambda: new Metaparam()
      .setType(Metaparam.type.FLOAT)
      .setDefault(1 / 1000)
      .setDomainFunction(() => Domain.ANY)
      .setName("average value")
      .setDescription("average value of the nagetive exp distribution")
  };

  constructor(){ super() }

  getDelay(params){ return -Math.log(1 - Math.random()) / params.lambda; }

  /* implmentation abstract methods from Node class */
  getNumberPort(params){ return params.isDeterministic ? 3 : 2; }
  onStart(env, state, params){
    if(!params.isDeterministic) env.send(this.loopback, {}, this.getDelay(params));
  }

  onReceive(env, state, params, port, message){
    if(port.id == -1 || port.id == 2){
      if(!state.stack.empty()){
        env.send(this.ports[1], state.stack.top(), 0);
        state.stack.pop();
      }
      if(!params.isDeterministic)
        env.send(this.loopback, {}, this.getDelay(params));
    }else{
      if(params.isInfinite || params.size > state.stack.size())
        state.stack.push(message);
    }
    return state;
  }
  initState(params){ return {stack: new stack()}; }
  onPortConnect(port){}
  onPortDisconnect(port){}
}

class LIFOGNode extends DefaultGNode{
  constructor(node){ super(node); }

  /* implmentation abstract methods from GNode class */
  onParamChange(params){ this.size = new vec2(100, 200); this.ratio = 0.75; }

  getPinPosition(idx, params){
    let ratio = this.ratio;

    if(idx == 0) return new vec2(0, 0);
    if(idx == 1) return new vec2(this.size.x, 0);
    if(idx == 2) return new vec2(this.size.x - 0.1 * (1 - ratio) * this.size.y, 0.6 * (1 - ratio) * this.size.y)
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
    let ratio = this.ratio;

    ctx.fillStyle = "rgb(230, 230, 230)";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.rect(0, (1 - ratio) * this.size.y, this.size.x, ratio * this.size.y);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.size.x - 0.5 * (1 - ratio) * this.size.y, 0.6 * (1 - ratio) * this.size.y, 0.4 * (1 - ratio) * this.size.y, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.size.x * 0.25, 0);
    ctx.lineTo(this.size.x * 0.25, 0.25 * this.size.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.size.x, 0);
    ctx.lineTo(this.size.x * 0.75, 0);
    ctx.lineTo(this.size.x * 0.75, 0.2 * (1 - ratio) * this.size.y);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = Math.floor(0.6 * (1 - ratio) * this.size.y) + "px Courier New";
    let txtSize = ctx.measureText("\u{03BB}");
    ctx.fillText("\u{03BB}", this.size.x - 0.5 * (1 - ratio) * this.size.y - txtSize.width * 0.4, 0.6 * (1 - ratio) * this.size.y + 0.4 * (1 - ratio) * this.size.x);

    if(!params.isInfinite){
      ctx.fillStyle = "yellow";
      ctx.fillRect(0, this.size.y, this.size.x, -ratio * this.size.y * state.stack.size() / params.size);

      let cols = 6;
      for(let i = 1; i < cols; i++){
        ctx.beginPath();
        ctx.moveTo(0, Math.floor((i / cols) * ratio * this.size.y + (1 - ratio) * this.size.y));
        ctx.lineTo(this.size.x, Math.floor((i / cols) * ratio * this.size.y + (1 - ratio) * this.size.y));
        ctx.stroke();
      }
    }else{
      ctx.font = Math.floor(this.size.x) + "px Courier New";
      let txtSize = ctx.measureText("\u{221E}");
      ctx.fillText("\u{221E}", 0.5 * this.size.x - 0.5 * txtSize.width, 0.75 * this.size.y);
    }
  }
}
