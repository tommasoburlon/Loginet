//Logic part of the Node
class SourceNode extends Node{

  static metadata = {
    name: "SourceNode",
    path: "IO",
    desc: "node that send message",
    clone: () => new SourceGNode(new SourceNode())
  };

  static metaparams = {
    ports : new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(1)
      .setDomainFunction((params) => Domain.ANY)
      .setName("ports")
      .setDescription("number of output ports"),
    periodic: new Metaparam()
      .setType(Metaparam.type.BOOLEAN)
      .setDefault(false)
      .setDomainFunction((params) => new FiniteDomain([true, false]))
      .setName("periodic")
      .setDescription("set the source in periodic mode")
  };

  constructor(){ super() }

  /* implmentation abstract methods from Node class */
  onStart(env, state, params){ if(params.periodic) env.send(this.loopback, {}, 1000); }
  onReceive(env, state, params, port, message){
    if(params.periodic) env.send(this.loopback, {}, 1000);

    for(let port of this.ports) env.send(port, { timestamp: env.globalTime}, 0);
    return state;
  }
  initState(params){ return undefined; }
  onPortConnect(port){}
  onPortDisconnect(port){}
  getNumberPort(params){ return params.ports; }
}

class SourceGNode extends DefaultGNode{
  constructor(node){ super(node); }

  /* implmentation abstract methods from GNode class */
  onParamChange(params){ this.size = new vec2(50, 50); }
  onClick(env, state, params, pos){
    if(!params.periodic){
      env.send(this.node.loopback, {}, 0);
    }
  }
  onMouseMove(pos){}
  getPinPosition(idx, params){ return new vec2(this.size.x, this.size.y * (idx + 1) / (this.getNumberPins(params) + 1)); }
  getPinLabel(idx, params){ return "out_" + idx; }
  getPinLabelLocation(idx, params){ return [1, 1]; }

}
