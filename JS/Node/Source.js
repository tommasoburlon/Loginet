let SourceNodeMetadata, SourceNodeMetaparams;

SourceNodeMetaparams = {
  nOutput : new Metaparameter(paramType.INTEGER, 1, (val) => val >= 1),
  T : new Metaparameter(paramType.INTEGER, 100, (val) => val > 0)
};

SourceNodeMetadata = new NodeMetadata(
  "Source Node",
  "misc",
  SourceNodeMetaparams,
  (env) => new GSourceNode(new SourceNode(env)),
  "it send packets out periodically with period T"
);

class SourceNode extends Node{
  constructor(env){
    super(env, SourceNodeMetadata);

    this.reset();
  }

  update(idx, pkt){
    this.sendPacket(-1, {type : 0}, this.params.T);

    for(let i = 0; i < this.params.nOutput; i++)
      this.sendPacket(i, {value : 500}, this.params.T);
  }

  init(){
    this.sendPacket(-1, {type : 0}, this.params.T);
  }
}

class GSourceNode extends GNode{
  constructor(_env, _node){
    super(_env, _node);

    this.size = new vec3(50.0, 50.0);
    this.setPins();
  }

  setPins(){
    for(let i = 0; i < this.pins.length; i++){
      this.pins[i].position = new vec3(this.size.x, this.size.y * (i + 1) / (this.pins.length + 1));
    }
  }
}

registerNode(SourceNodeMetadata);
