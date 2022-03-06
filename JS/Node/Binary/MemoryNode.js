let MemoryNodeMetadata, MemoryNodeMetaparams;

//  Metaparameters of the node (type of the param, default value, function to check the validity, function to check if the param have effect on the node)
MemoryNodeMetaparams = {
  nInput   : new Metaparameter(paramType.INTEGER, 1, (val) => val >= 1),
  type     : new Metaparameter(paramType.ENUM, "SR", (val) => ["SR", "D", "D-flipflop"]),
  delay    : new Metaparameter(paramType.INTEGER, 0, (val) => val >= 0),
};

// Metadata of the node (Name, category, metaparameters, builder function, description)
MemoryNodeMetadata = new NodeMetadata(
  "Memory Node",
  "Binary",
  MemoryNodeMetaparams,
  (env) => new GMemoryNode(new MemoryNode(env)),
  "Memory node"
);

//Logic part of the Node
class MemoryNode extends BinaryNode{
  constructor(_env){
    super(_env, MemoryNodeMetadata);

    //create the links
    this.reset();
  }

  // this handler is called when the node receive a packet
  updateCircuit(preInput, input){
    let nq, q = new bitarray(1);

    if(this.params.type == "SR"){
      if(input[0].get(0)){
        this.state.memory.set(0);
      }else if(input[1].get(0)){
        this.state.memory.reset(0);
      }

      if(input[0].get(0) && input[1].get(0))
        this.state.memory.setBit(0, Math.floor(2 * Math.random()));
    }

    if(this.params.type == "D"){
      if(input[1].get(0))
        this.state.memory.setBit(0, input[0].get(0));
    }

    if(this.params.type == "D-flipflop"){
      if(input[1].get(0) && !preInput[1].get(0))
        this.state.memory.setBit(0, input[0].get(0));
    }

    q = this.state.memory.clone();
    nq = q.clone();
    nq.invert(0);

    this.output(0, q);
    this.output(1, nq);
  }

  initCircuit(){
    this.updateNode();
  }
  // this handler is called at the start of the simulation
  updateNode(){
    this.state.memory = new bitarray(1);
    for(let i = 0; i < this.lastInput.length; i++){
      this.lastInput[i] = new bitarray(1);
      this.newInput[i] = new bitarray(1);
    }
  }

  // should return the number of output link
  getNumberOutput(){
    return 2;
  }
  getNumberInput(){
    return 2;
  }
}

// Graphical part of the node
class GMemoryNode extends GNode{
  constructor(_node){
    super(_node);

    this.setPins();
  }

  //draw function
  draw(cnv, ctx){
    ctx.fillStyle = "rgb(220, 220, 220)";
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.rect(0, 0, this.size.x, this.size.y);
    ctx.stroke();
    ctx.fill();


  }

  //function to set the position of the pins of the node
  setPins(){
    let N = this.node.getNumberInput();

    this.pins[0].position = new vec3(0, 0.2 * this.size.y);
    this.pins[0].name = this.node.params.type == "SR" ? "set" : "data";
    this.pins[0].nameLocation = [-1, 1];

    this.pins[1].position = new vec3(0, 0.8 * this.size.y);
    this.pins[1].name = this.node.params.type == "SR" ? "reset" : "enable";
    this.pins[1].nameLocation = [-1, 1];

    this.pins[2].position = new vec3(this.size.x, 0.2 * this.size.y);
    this.pins[2].name = "Q";
    this.pins[2].nameLocation = [1, 1];

    this.pins[3].position = new vec3(this.size.x, 0.8 * this.size.y);
    this.pins[3].name = "/Q";
    this.pins[3].nameLocation = [1, 1];

  }


  //handler that is called when a parameter is edited
  onParamChange(){
    this.size = new vec3(100, 80 + 15 * this.node.params.nInput);
  }

}

// register the node using its metadata so the GUI can be updated
registerNode(MemoryNodeMetadata);
