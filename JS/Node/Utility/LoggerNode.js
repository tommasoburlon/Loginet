//Logic part of the Node
class LoggerNode extends Node{

  static metadata = {
    name: "LoggerNode",
    path: "utility",
    desc: "node that print every message into the console",
    clone: () => new LoggerGNode(new LoggerNode())
  };

  static metaparams = {
    ports : new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(2)
      .setDomainFunction((params) => new FiniteDomain([2]))
      .setName("ports")
      .setDescription("number of ports")
  };

  constructor(){ super() }

  /* implmentation abstract methods from Node class */
  onReceive(env, state, params, port, message){
    if(port.id != 0) return undefined;
    let log = {message: message, timestamp: env.globalTime, port: port};
    console.log(log);
    return undefined;
  }
  initState(params){ return undefined; }
  onPortConnect(port){}
  onPortDisconnect(port){}
}

class LoggerGNode extends DefaultGNode{
  constructor(node){ super(node); }

  /* implmentation abstract methods from GNode class */
  onParamChange(params){ this.size = new vec2(200, 100)}
  onClick(pos){}
  onMouseMove(pos){}
  getPinPosition(idx, params){ return new vec2(idx == 0 ? 0 : this.size.x, this.size.y * 0.5); }
  getPinLabel(idx, params){ return idx == 0 ? "in" : "out"; }
  getPinLabelLocation(idx, params){ return idx == 0 ? [-1, -1] : [1, -1]}
  draw(cnv, ctx, state, params){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "rgb(150, 150, 150)";

    ctx.beginPath();
    ctx.rect(0, 0, this.size.x, this.size.y);
    ctx.fill();
    ctx.stroke();
  }

}
