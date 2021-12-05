let ButtonNodeMetadata, ButtonNodeMetaparams;

//  Metaparameters of the node (type of the param, default value, function to check the validity, function to check if the param have effect on the node)
ButtonNodeMetaparams = {
  delay    : new Metaparameter(paramType.INTEGER, 0, (val) => val >= 0),
};

// Metadata of the node (Name, category, metaparameters, builder function, description)
ButtonNodeMetadata = new NodeMetadata(
  "Button Node",
  "Binary",
  ButtonNodeMetaparams,
  (env) => new GButtonNode(new ButtonNode(env)),
  "Button node"
);

//Logic part of the Node
class ButtonNode extends BinaryNode{
  constructor(_env){
    super(_env, ButtonNodeMetadata);

    //create the links
    this.reset();
  }

  // this handler is called when the node receive a packet
  updateCircuit(preInput, input){
    //this.output(outputID, bitarray);
    let ret = new bitarray(1);
    ret.setBit(0, this.state.output);
    this.output(0, ret);
  }

  // this handler is called at the start of the simulation
  initCircuit(){
    this.state.output = 0;
  }

  // should return the number of output link
  getNumberOutput(){
    return 1;
  }
}

// Graphical part of the node
class GButtonNode extends GNode{
  constructor(_node){
    super(_node);

    this.setPins();
  }

  //draw function
  draw(cnv, ctx){
    let margin = 0.2 * this.size.x;

    ctx.fillStyle = "rgb(220, 220, 220)";
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.rect(0, 0, this.size.x, this.size.y);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = (this.node.state.output) ? "yellow" : "rgb(100, 100, 100)";

    ctx.beginPath();
    ctx.rect(margin, margin, this.size.x - 2 * margin, this.size.y - 2 * margin);
    ctx.stroke();
    ctx.fill();
  }

  //function to set the position of the pins of the node
  setPins(){
    this.pins[0].position = new vec3(this.size.x, 0.5 * this.size.y);
    this.pins[0].name = "out";
    this.pins[0].nameLocation = [1, 1];
  }

  //handler that is called when a parameter is edited
  onParamChange(){
    this.size = new vec3(50, 50);
  }

  onClick(evt){
    this.node.state.output = (this.node.state.output) ? 0 : 1;
    this.node.updateCircuit();
    return 0;
  }

}

// register the node using its metadata so the GUI can be updated
registerNode(ButtonNodeMetadata);
