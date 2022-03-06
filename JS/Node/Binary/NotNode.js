let NotNodeMetadata, NotNodeMetaparams;

//  Metaparameters of the node (type of the param, default value, function to check the validity, function to check if the param have effect on the node)
NotNodeMetaparams = {
  nInput   : new Metaparameter(paramType.INTEGER, 1, (val) => val >= 1),
  delay    : new Metaparameter(paramType.INTEGER, 0, (val) => val >= 0),
};

// Metadata of the node (Name, category, metaparameters, builder function, description)
NotNodeMetadata = new NodeMetadata(
  "Not Node",
  "Binary",
  NotNodeMetaparams,
  (env) => new GNotNode(new NotNode(env)),
  "Not node"
);

//Logic part of the Node
class NotNode extends BinaryNode{
  constructor(_env){
    super(_env, NotNodeMetadata);

    //create the links
    this.reset();
  }

  // this handler is called when the node receive a packet
  updateCircuit(preInput, input){
    //this.output(outputID, bitarray);
    for(let i = 0; i < preInput.length; i++){
      if(preInput[i].value != input[i].value){
        let ret = new bitarray(input[i].size);
        ret.value = input[i].value;
        for(let j = 0; j < ret.size; j++)
          ret.invert(j);
        this.output(i, ret);
      }
    }
  }

  initCircuit(){
    this.updateNode();
  }
  // this handler is called at the start of the simulation
  updateNode(){
    for(let i = 0; i < this.lastInput.length; i++){
      this.lastInput[i] = new bitarray(1);
      this.newInput[i] = new bitarray(1);
    }
  }

  // should return the number of output link
  getNumberOutput(){
    return this.params.nInput;
  }
  getNumberInput(){
    return this.params.nInput;
  }
}

// Graphical part of the node
class GNotNode extends GNode{
  constructor(_node){
    super(_node);

    this.setPins();
  }

  //draw function
  draw(cnv, ctx){
    ctx.fillStyle = "rgb(220, 220, 220)";
    ctx.strokeStyle = "black";

    let N = this.node.getNumberInput();
    for(let i = 0; i < N; i++){
      ctx.beginPath();
      ctx.moveTo(this.pins[i].position.x, this.pins[i].position.y);
      ctx.lineTo(this.pins[i].position.x + this.size.x * 0.2, this.pins[i].position.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.pins[i + N].position.x, this.pins[i + N].position.y);
      ctx.lineTo(this.pins[i + N].position.x - this.size.x * 0.2, this.pins[i + N].position.y);
      ctx.stroke();
    }

    if(this.node.params.nInput > 1){
      ctx.beginPath();
      ctx.rect(this.size.x * 0.1, 0, this.size.x * 0.8, this.size.y);
      ctx.stroke();
      ctx.fill();
    }else{
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, this.size.y);
      ctx.lineTo(this.size.x * 0.8, this.size.y * 0.5);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.size.x * 0.9, this.size.y * 0.5, this.size.x * 0.1, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }

  }

  //function to set the position of the pins of the node
  setPins(){
    let N = this.node.getNumberInput();
    for(let i = 0; i < N; i++){
      this.pins[i].position = new vec3(0, this.size.y * (i + 1) / (N + 1));
      this.pins[i].name = "in_" + i;
      this.pins[i].nameLocation = [-1, 1];
    }
    for(let i = N; i < 2 * N; i++){
      this.pins[i].position = new vec3(this.size.x, this.size.y * (i - N + 1) / (N + 1));
      this.pins[i].name = "out";
      this.pins[i].nameLocation = [1, 1];
    }
  }


  //handler that is called when a parameter is edited
  onParamChange(){
    this.size = new vec3(100, 80 + 15 * this.node.params.nInput);
  }

}

// register the node using its metadata so the GUI can be updated
registerNode(NotNodeMetadata);
