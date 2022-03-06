let MergerNodeMetadata, MergerNodeMetaparams;

//  Metaparameters of the node (type of the param, default value, function to check the validity, function to check if the param have effect on the node)
MergerNodeMetaparams = {
  nInput  : new Metaparameter(paramType.INTEGER, 2, (val) => (val > 0)),
  nOutput : new Metaparameter(paramType.CONSTANT, 1, (val) => true)
};

// Metadata of the node (Name, category, metaparameters, builder function, description)
MergerNodeMetadata = new NodeMetadata(
  "Merger Node",
  "Utility",
  MergerNodeMetaparams,
  (env) => new GMergerNode(new MergerNode(env)),
  ""
);

//Logic part of the Node
class MergerNode extends Node{
  constructor(_env){
    super(_env, MergerNodeMetadata);

    //create the links
    this.reset();
  }

  // this handler is called when the node receive a packet
  update(gateIdx, pkt){
    this.sendPacket(this.params.nInput, pkt, 0);
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
class GMergerNode extends GNode{
  constructor(_node){
    super(_node);

  }

  //draw function
  draw(cnv, ctx){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.moveTo(0.5 * this.size.x, 0.5 * this.size.y);
    ctx.lineTo(this.size.x, 0.5 * this.size.y);
    ctx.stroke();

    for(let i = 0; i < this.pins.length - 1; i++){
      ctx.beginPath();
      ctx.moveTo(0, this.pins[i].position.y);
      ctx.lineTo(0.5 * this.size.x, this.pins[i].position.y);
      ctx.lineTo(0.5 * this.size.x, 0.5 * this.size.y);
      ctx.stroke();
    }
  }

  //function to set the position of the pins of the node
  setPins(){

    let i;

    for(i = 0; i < this.pins.length - 1; i++){
      this.pins[i].position = new vec3(0, (i + 1) * this.size.y / this.pins.length);
      this.pins[i].name = ""; //"out_" + (i - 1);
      this.pins[i].nameLocation = [-1, 1];
    }

    this.pins[i].position = new vec3(this.size.x, 0.5 * this.size.y);
    this.pins[i].name = ""; //"in";
    this.pins[i].nameLocation = [1, 1];

  }

  //handler that is called when a parameter is edited
  onParamChange(){
    this.size = new vec3(60, 100 + 10 * this.node.params.nOutput);
  }

}

// register the node using its metadata so the GUI can be updated
registerNode(MergerNodeMetadata);
