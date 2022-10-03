//Logic part of the Node
class DummyNode extends Node{

  static metadata = {
    name: "DummyNode",
    path: "misc",
    desc: "example node",
    clone: () => new DummyGNode(new DummyNode())
  };

  static metaparams = {
    ports : new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(2)
      .setDomainFunction()
      .setName("ports")
      .setDescription("number of ports")
  };

  constructor(){ super() }

  /* implmentation abstract methods from Node class */
  onReceive(env, state, params, port, message){ return state; }
  initState(params){ return {}; }
  onPortConnect(port){}
  onPortDisconnect(port){}
}

class DummyGNode extends GNode{
  constructor(node){ super(node); }

  /* implmentation abstract methods from GNode class */
  onParamChange(params){}
  onClick(env, state, params, pos){}
  onMouseMove(pos){}
  getPinPosition(idx, params){}
  getPinLabel(idx, params){}
  getPinLabelLocation(idx, params){}
  isPointInside(pos){}
  draw(cnv, ctx, state, params){}

}
