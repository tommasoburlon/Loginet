let CopyNodeMetadata, CopyNodeMetaparams;

//  Metaparameters of the node (type of the param, default value, function to check the validity, function to check if the param have effect on the node)
CopyNodeMetaparams = {
  nInput  : new Metaparameter(paramType.CONSTANT, 1, (val) => true),
  nOutput : new Metaparameter(paramType.INTEGER, 2, (val) => (val > 0))
};

// Metadata of the node (Name, category, metaparameters, builder function, description)
CopyNodeMetadata = new NodeMetadata(
  "Copy Node",
  "Utility",
  CopyNodeMetaparams,
  (env) => new GCopyNode(new CopyNode(env)),
  "send the input node to every output"
);

//Logic part of the Node
class CopyNode extends Node{
  constructor(_env){
    super(_env, CopyNodeMetadata);

    //create the links
    this.reset();
  }

  // this handler is called when the node receive a packet
  update(gateIdx, pkt){
    for(let i = 0; i < this.params.nOutput; i++){
      this.sendPacket(i + 1, pkt, 0);
    }
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

  // this handler is called when the params of the node is changed
  updateNode(){

  }
}

// Graphical part of the node
class GCopyNode extends GNode{
  constructor(_node){
    super(_node);

  }

  //draw function
  draw(cnv, ctx){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(0, 0.5 * this.size.y);
    ctx.lineTo(0.5 * this.size.x, 0.5 * this.size.y);
    ctx.stroke();

    for(let i = 1; i < this.pins.length; i++){
      ctx.beginPath();
      ctx.moveTo(this.size.x, this.pins[i].position.y);
      ctx.lineTo(0.5 * this.size.x, this.pins[i].position.y);
      ctx.lineTo(0.5 * this.size.x, 0.5 * this.size.y);
      ctx.stroke();
    }
  }

  //function to set the position of the pins of the node
  setPins(){

    this.pins[0].position = new vec3(0, 0.5 * this.size.y);
    this.pins[0].name = ""; //"in";
    this.pins[0].nameLocation = [1, 1];

    for(let i = 1; i < this.pins.length; i++){
      this.pins[i].position = new vec3(this.size.x, i * this.size.y / this.pins.length);
      this.pins[i].name = ""; //"out_" + (i - 1);
      this.pins[i].nameLocation = [-1, 1];
    }

  }

  //handler that is called when a parameter is edited
  onParamChange(){
    this.size = new vec3(60, 100 + 10 * this.node.params.nOutput);
  }

}

// register the node using its metadata so the GUI can be updated
registerNode(CopyNodeMetadata);
