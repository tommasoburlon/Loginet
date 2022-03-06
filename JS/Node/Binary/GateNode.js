let GateNodeMetadata, GateNodeMetaparams;

//  Metaparameters of the node (type of the param, default value, function to check the validity, function to check if the param have effect on the node)
GateNodeMetaparams = {
  nInput   : new Metaparameter(paramType.INTEGER, 2, (val) => val >= 2),
  gateType : new Metaparameter(paramType.ENUM, "AND", (val) => ["AND", "OR", "XOR"]),
  delay    : new Metaparameter(paramType.INTEGER, 0, (val) => val >= 0),
};

// Metadata of the node (Name, category, metaparameters, builder function, description)
GateNodeMetadata = new NodeMetadata(
  "Gate Node",
  "Binary",
  GateNodeMetaparams,
  (env) => new GGateNode(new GateNode(env)),
  "gate node"
);

//Logic part of the Node
class GateNode extends BinaryNode{
  constructor(_env){
    super(_env, GateNodeMetadata);

    //create the links
    this.reset();
  }

  // this handler is called when the node receive a packet
  /*updateCircuit(preInput, input){
    //this.output(outputID, bitarray);
  }*/

  initCircuit(){
    this.updateNode();
  }
  // this handler is called at the start of the simulation
  updateNode(){

    if(this.params.gateType == "AND"){
      this.updateCircuit = function(pre, input){
        let ret = new bitarray(1), temp = 1;
        for(let i in input)
          temp &= input[i].get(0);
        ret.setBit(0, temp);
        this.output(0, ret);
      }
    }

    if(this.params.gateType == "OR"){
      this.updateCircuit = function(pre, input){
        let ret = new bitarray(1), temp = 0;
        for(let i in input)
          temp |= input[i].get(0);
        ret.setBit(0, temp);
        this.output(0, ret);
      }
    }

    if(this.params.gateType == "XOR"){
      this.updateCircuit = function(pre, input){
        let ret = new bitarray(1), temp = 0;
        
        for(let i in input){
          temp += input[i].get(0);
        }
        ret.setBit(0, (temp % 2));
        this.output(0, ret);
      }
    }

    for(let i in this.lastInput){
      this.lastInput[i] = new bitarray(1);
      this.newInput[i] = new bitarray(1);
    }
  }

  // should return the number of output link
  getNumberOutput(){
    return 1;
  }
}

// Graphical part of the node
class GGateNode extends GNode{
  constructor(_node){
    super(_node);

    this.setPins();
  }

  //draw function
  draw(cnv, ctx){
    ctx.fillStyle = "rgb(220, 220, 220)";
    ctx.strokeStyle = "black";

    for(let i = 0; i < this.pins.length - 1; i++){
      ctx.beginPath();
      ctx.moveTo(this.pins[i].position.x, this.pins[i].position.y);
      ctx.lineTo(this.pins[i].position.x + this.size.x * 0.2, this.pins[i].position.y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(this.size.x, 0.5 * this.size.y);
    ctx.lineTo(this.size.x - this.size.x * 0.25, 0.5 * this.size.y);
    ctx.stroke();

    ctx.save();

    if(this.node.params.gateType == "AND" || this.node.params.gateType == "NAND"){
      ctx.beginPath();
      ctx.moveTo(0.5 * this.size.x, 0);
      ctx.lineTo(0.2 * this.size.x, 0);
      ctx.lineTo(0.2 * this.size.x, this.size.y);
      ctx.lineTo(0.5 * this.size.x, this.size.y);
      ctx.bezierCurveTo(this.size.x, this.size.y, this.size.x, 0, 0.5 * this.size.x, 0);
      ctx.stroke();
      ctx.fill();
    }

    if(this.node.params.gateType == "OR" || this.node.params.gateType == "NOR"){
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(0.3 * this.size.x, this.size.y * 0.2, 0.3 * this.size.x, this.size.y * 0.8, 0, this.size.y);
      ctx.bezierCurveTo(0.5 * this.size.x, this.size.y, 0.6 * this.size.x, this.size.y, this.size.x, 0.5 * this.size.y);
      ctx.bezierCurveTo(0.6 * this.size.x, 0, 0.5 * this.size.x, 0, 0, 0);
      ctx.stroke();
      ctx.fill();
    }

    if(this.node.params.gateType == "XOR" || this.node.params.gateType == "XNOR"){
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(0.3 * this.size.x, this.size.y * 0.2, 0.3 * this.size.x, this.size.y * 0.8, 0, this.size.y);
      ctx.lineTo(0,this.size.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0.1 * this.size.x, 0);
      ctx.bezierCurveTo(0.4 * this.size.x, this.size.y * 0.2, 0.4 * this.size.x, this.size.y * 0.8, 0.1 * this.size.x, this.size.y);
      ctx.bezierCurveTo(0.6 * this.size.x, this.size.y, 0.7 * this.size.x, this.size.y, this.size.x, 0.5 * this.size.y);
      ctx.bezierCurveTo(0.7 * this.size.x, 0, 0.6 * this.size.x, 0, 0.1 * this.size.x, 0);
      ctx.stroke();
      ctx.fill();
    }

    ctx.clip();
    ctx.fillStyle = "black";
    ctx.font = "30px Courier New"
    ctx.textBaseline = "middle";

    if(this.node.params.gateType == "XOR" || this.node.params.gateType == "XNOR")
      ctx.fillText(this.node.params.gateType, this.size.x * 0.3, this.size.y * 0.5);
    else
      ctx.fillText(this.node.params.gateType, this.size.x * 0.25, this.size.y * 0.5);
    ctx.restore();
  }

  //function to set the position of the pins of the node
  setPins(){
    let N = this.node.getNumberInput();
    for(let i = 0; i < N; i++){
      this.pins[i].position = new vec3(0, this.size.y * (i + 1) / (N + 1));
      this.pins[i].name = "in_" + i;
      this.pins[i].nameLocation = [-1, 1];
    }
    this.pins[N].position = new vec3(this.size.x, 0.5 * this.size.y);
    this.pins[N].name = "out";
    this.pins[N].nameLocation = [1, 1];
  }


  //handler that is called when a parameter is edited
  onParamChange(){
    this.size = new vec3(100, 80 + 15 * this.node.params.nInput);
  }

}

// register the node using its metadata so the GUI can be updated
registerNode(GateNodeMetadata);
