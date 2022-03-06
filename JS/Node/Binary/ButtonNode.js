let ButtonNodeMetadata, ButtonNodeMetaparams;

//  Metaparameters of the node (type of the param, default value, function to check the validity, function to check if the param have effect on the node)
ButtonNodeMetaparams = {
  nButton  : new Metaparameter(paramType.INTEGER, 1, (val) => val >= 1),
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
  updateCircuit(idx = -1){

    for(let i = 0; i < this.getNumberOutput(); i++){
      let ret = new bitarray(1);
      ret.setBit(0, this.state.output.get(i));
      this.output(i, ret);
    }
  }

  // this handler is called at the start of the simulation
  initCircuit(){
    this.state.output = new bitarray(this.params.nButton);
  }

  updateNode(){
    this.state.output = new bitarray(this.params.nButton);
  }

  // should return the number of output link
  getNumberOutput(){
    return this.params.nButton;
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

    for(let i = 0; i < this.pins.length; i++){
      ctx.fillStyle = (this.node.state.output.get(i)) ? "yellow" : "rgb(100, 100, 100)";

      ctx.beginPath();
      ctx.arc(this.size.x * 0.5, (this.size.y / this.pins.length) * (i + 0.5), 0.5 * this.size.x - margin, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }
  }

  //function to set the position of the pins of the node
  setPins(){
    let margin = 0.2 * this.size.x;

    for(let i = 0; i < this.pins.length; i++){
      this.pins[i].position = new vec3(
        this.size.x,
        (this.size.y / this.pins.length) * (i + 0.5)
      );
      this.pins[i].name = "out_" + i;
      this.pins[i].nameLocation = [1, 1];
    }
  }

  //handler that is called when a parameter is edited
  onParamChange(){
    this.size = new vec3(50, 40 * this.node.params.nButton);
  }

  onClick(pos){
    let height = (this.size.y / this.pins.length), width = this.size.x;
    let dy = pos.y % height, dx = pos.x, idx;
    idx = Math.floor(pos.y / height);

    if((dy - height * 0.5) * (dy - height * 0.5) + (dx - width * 0.5) * (dx - width * 0.5) < (0.3 * width) * (0.3 * width)){
      this.node.state.output.invert(idx);

      this.node.updateCircuit();
      return 0;
    }else{
      return 1;
    }
  }

}

// register the node using its metadata so the GUI can be updated
registerNode(ButtonNodeMetadata);
