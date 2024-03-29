//Logic part of the Node
class CopyNode extends Node{

  static metadata = {
    name: "CopyNode",
    path: "misc",
    desc: "nodes that copy a message into different port",
    clone: () => new CopyGNode(new CopyNode())
  };

  static metaparams = {
    ports : new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(3)
      .setDomainFunction((params) => Domain.Any)
      .setName("output")
      .setDescription("number of output port")
  };

  constructor(){ super() }

  /* implmentation abstract methods from Node class */
  onReceive(env, state, params, port, message){
    for(let i = 1; i < this.ports.length; i++)
      env.send(this.ports[i], message, 0);
    return state;
  }
  initState(params){ return undefined; }
  onPortConnect(port){}
  onPortDisconnect(port){}
  getNumberPort(params){ return params.ports + 1; }
}

class CopyGNode extends DefaultGNode{
  constructor(node){ super(node); }

  /* implmentation abstract methods from GNode class */
  onParamChange(params){ this.size = new vec2(60, 10 + 20 * (this.getNumberPins(params) - 1)); }
  getPinPosition(idx, params){
    if(idx == 0)
      return new vec2(0, 0.5 * this.size.y);
    return new vec2(this.size.x, this.size.y * (idx - 1) / (this.getNumberPins(params) - 2));
  }

  getPinLabel(idx, params){
    if(idx == 0) return "in";
    return "out_" + (idx - 1);
  }
  getPinLabelLocation(idx, params){
    return idx == 0 ? [-1, 1] : [1, 1];
  }


  draw(cnv, ctx, state, params){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(0, 0.5 * this.size.y);
    ctx.lineTo(0.5 * this.size.x, 0.5 * this.size.y);
    ctx.stroke();

    for(let i = 1; i < this.getNumberPins(params); i++){
      let pos = this.getPinPosition(i, params);
      ctx.beginPath();
      ctx.moveTo(this.size.x, pos.y);
      ctx.lineTo(0.5 * this.size.x, pos.y);
      ctx.lineTo(0.5 * this.size.x, 0.5 * this.size.y);
      ctx.stroke();
    }
  }

}
