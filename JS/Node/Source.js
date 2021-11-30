class SourceNode extends Node{
  constructor(env){
    super(env);

    this.metaparams = {
      nOutput : new Metaparameter(paramType.INTEGER, 1, (val) => val == 1),
    };

    this.reset();
  }null

  update(idx, pkt){
    this.sendPacket(-1, {type : 0}, 100);
    this.sendPacket(0, {value : 500}, 100);
  }

  init(){
    this.sendPacket(-1, {type : 0}, 100);
  }
}

class GSourceNode extends GNode{
  constructor(_env, _node){
    super(_env, _node);

    this.size = new vec3(50.0, 50.0);
    this.position = new vec3(20.0, 20.0);
    this.pins[0].position = new vec3(50.0, 25.0);
  }
}
