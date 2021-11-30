
class DummyNode extends Node{
  constructor(_env){
    super(_env);

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

registerNode(
  "Dummy Node",
  (env) => new GDummyNode(new DummyNode(env)),
  "misc",
  "An example of a simple node class"
);
