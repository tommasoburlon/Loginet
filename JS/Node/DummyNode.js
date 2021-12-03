let DummyNodeMetadata, DummyNodeMetaparams;

DummyNodeMetaparams = {
  nInput  : new Metaparameter(paramType.CONSTANT, 0, (val) => true),
  nOutput : new Metaparameter(paramType.CONSTANT, 0, (val) => true)
};

DummyNodeMetadata = new NodeMetadata(
  "Dummy Node",
  "misc",
  DummyNodeMetaparams,
  (env) => new GDummyNode(new DummyNode(env)),
  "simplest node example"
);

class DummyNode extends Node{
  constructor(_env){
    super(_env, DummyNodeMetadata);


    this.metaparams = {
      nInput  : new Metaparameter(paramType.INTEGER, 0, (val) => true),
      nOutput : new Metaparameter(paramType.INTEGER, 0, (val) => true)
    };

    this.reset();
  }

  update(gateIdx, pkt){

  }

  init(){

  }

  onLinkUpdate(idx){

  }
}

class GDummyNode extends GNode{
  constructor(_node){
    super(_node);
  }

  draw(cnv, ctx){

  }
}

registerNode(DummyNodeMetadata);
