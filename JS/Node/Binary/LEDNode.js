let LEDNodeMetadata, LEDNodeMetaparams;

//  Metaparameters of the node (type of the param, default value, function to check the validity, function to check if the param have effect on the node)
LEDNodeMetaparams = {
  delay    : new Metaparameter(paramType.INTEGER, 0, (val) => val >= 0),
};

// Metadata of the node (Name, category, metaparameters, builder function, description)
LEDNodeMetadata = new NodeMetadata(
  "LED Node",
  "Binary",
  LEDNodeMetaparams,
  (env) => new GLEDNode(new LEDNode(env)),
  "LED node"
);

//Logic part of the Node
class LEDNode extends BinaryNode{
  constructor(_env){
    super(_env, LEDNodeMetadata);

    //create the links
    this.reset();
  }

  // this handler is called when the node receive a packet
  updateCircuit(preInput, input){
    //this.output(outputID, bitarray);
    this.state.input = input[0].get(0)
  }

  // this handler is called at the start of the simulation
  initCircuit(){
    this.state.input = 0;
  }

  updateNode(){
    for(let i = 0; i < this.lastInput.length; i++){
      this.lastInput[i] = new bitarray(1);
      this.newInput[i] = new bitarray(1);
    }
  }

  // should return the number of output link
  getNumberInput(){
    return 1;
  }
}

// Graphical part of the node
class GLEDNode extends GNode{
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

    ctx.fillStyle = (this.node.state.input) ? "yellow" : "rgb(100, 100, 100)";

    ctx.beginPath();
    ctx.rect(margin, margin, this.size.x - 2 * margin, this.size.y - 2 * margin);
    ctx.stroke();
    ctx.fill();
  }

  //function to set the position of the pins of the node
  setPins(){
    this.pins[0].position = new vec3(0, 0.5 * this.size.y);
    this.pins[0].name = "in";
    this.pins[0].nameLocation = [-1, 1];
  }

  //handler that is called when a parameter is edited
  onParamChange(){
    this.size = new vec3(50, 50);
  }

  onClick(evt){
    return 1;
  }

}

// register the node using its metadata so the GUI can be updated
registerNode(LEDNodeMetadata);
