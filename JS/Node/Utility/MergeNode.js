class MergeNode extends Node{

  static metadata = {
    name: "MergeNode",
    path: "misc",
    desc: "nodes that merge message from different port into a single one",
    clone: () => new MergeGNode(new MergeNode())
  };

  static metaparams = {
    ports : new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(3)
      .setDomainFunction((params) => Domain.ANY)
      .setName("input")
      .setDescription("number of input port")
  };

  constructor(){ super() }

  /* implmentation abstract methods from Node class */
  onReceive(env, state, params, port, message){
    env.send(this.ports[params.ports], message, 0);
    return state;
  }

  initState(params){ return undefined; }
  onPortConnect(port){}
  onPortDisconnect(port){}
  getNumberPort(params){ return params.ports + 1; }
}

class MergeGNode extends DefaultGNode{
  constructor(node){ super(node); }

  /* implmentation abstract methods from GNode class */
  onParamChange(params){ this.size = new vec2(60, 10 + 20 * (this.getNumberPins(params) - 1)); }
  getPinPosition(idx, params){
    if(idx == params.ports)
      return new vec2(this.size.x, 0.5 * this.size.y);
    return new vec2(0, this.size.y * idx / (this.getNumberPins(params) - 2));
  }

  getPinLabel(idx, params){
    if(idx == params.ports) return "out";
    return "in_" + idx;
  }

  getPinLabelLocation(idx, params){
    return idx == params.ports ? [1, 1] : [-1, 1];
  }


  draw(cnv, ctx, state, params){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    for(let i = 0; i < this.getNumberPins(params); i++){
      let pos = this.getPinPosition(i, params);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(0.5 * this.size.x, pos.y);
      ctx.lineTo(0.5 * this.size.x, 0.5 * this.size.y);
      ctx.stroke();
    }
  }

}
