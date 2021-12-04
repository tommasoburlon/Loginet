let DummyNodeMetadata, DummyNodeMetaparams;

//  Metaparameters of the node (type of the param, default value, function to check the validity, function to check if the param have effect on the node)
DummyNodeMetaparams = {
  nInput  : new Metaparameter(paramType.CONSTANT, 0, (val) => true),
  nOutput : new Metaparameter(paramType.CONSTANT, 0, (val) => true)
};

// Metadata of the node (Name, category, metaparameters, builder function, description)
DummyNodeMetadata = new NodeMetadata(
  "Dummy Node",
  "misc",
  DummyNodeMetaparams,
  (env) => new GDummyNode(new DummyNode(env)),
  "simplest node, example"
);

//Logic part of the Node
class DummyNode extends Node{
  constructor(_env){
    super(_env, DummyNodeMetadata);

    //create the links
    this.reset();
  }

  // this handler is called when the node receive a packet
  update(gateIdx, pkt){
    //this.sendPacket(getOut, Packet, delay);
  }

  // this handler is called at the start of the simulation
  init(){

  }

  // should return the number of input/output link
  getNumberLinks(){
    return (this.params.nInput || 0) + (this.params.nOutput || 0);
  }

  // this handler is called when a collection is created or desctructed
  onLinkUpdate(idx){

  }
}

// Graphical part of the node
class GDummyNode extends GNode{
  constructor(_node){
    super(_node);

  }

  //draw function
  draw(cnv, ctx){

  }

  //function to set the position of the pins of the node
  setPins(){

  }

  //handler that is called when a parameter is edited
  updateNode(){
    this.size = new vec3(100, 100);
  }

}

// register the node using its metadata so the GUI can be updated
registerNode(DummyNodeMetadata);
