let PrinterNodeMetadata, PrinterNodeMetaparams;

//  Metaparameters of the node (type of the param, default value, function to check the validity, function to check if the param have effect on the node)
PrinterNodeMetaparams = {
  width   : new Metaparameter(paramType.INTEGER, 150, (val) => val > 150),
  height  : new Metaparameter(paramType.INTEGER, 75, (val) => val > 75),
};

// Metadata of the node (Name, category, metaparameters, builder function, description)
PrinterNodeMetadata = new NodeMetadata(
  "Printer Node",
  "I_O",
  PrinterNodeMetaparams,
  (env) => new GPrinterNode(new PrinterNode(env)),
  "Node that prints the packets that it receive"
);

//Logic part of the Node
class PrinterNode extends Node{
  constructor(_env){
    super(_env, PrinterNodeMetadata);

    //create the links
    this.lastPacket = undefined;
    this.reset();
  }

  // this handler is called when the node receive a packet
  update(gateIdx, pkt){
    this.lastPacket = pkt;
    //this.sendPacket(getOut, Packet, delay);
    this.sendPacket(1, pkt, 0);
  }

  // this handler is called at the start of the simulation
  init(){
    this.lastPacket = undefined;
  }

  // should return the number of input/output link
  getNumberLinks(){
    return 2;
  }

  // this handler is called when a collection is created or desctructed
  onLinkUpdate(idx){

  }
}

// Graphical part of the node
class GPrinterNode extends GNode{
  constructor(_node){
    super(_node);

    this.timer = 50;
    this.prePacket = undefined;
  }

  //draw function
  draw(cnv, ctx){
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "rgb(220, 220, 220)";

    ctx.beginPath();
    ctx.rect(0, 0, this.size.x, this.size.y);
    ctx.stroke();
    ctx.fill();

    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = "red";

    if(this.prePacket != this.node.lastPacket){
      ctx.beginPath();
      ctx.arc(5, 5, 3, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      this.timer--;
    }

    if(this.timer == 0){
      this.timer = 5;
      this.prePacket = this.node.lastPacket;
    }

    ctx.save();

    ctx.beginPath();
    ctx.rect(0, 0, this.size.x, this.size.y);
    ctx.clip();
    if(this.node.lastPacket){
      let i = 0;
      ctx.fillStyle = "black";
      for(let o in this.node.lastPacket){
        ctx.font = "10px Courier New";
        ctx.fillText(o + ":" + this.node.lastPacket[o], 10, i * 20 + 20);
        i++;
      }
    }
    ctx.restore();
  }

  //function to set the position of the pins of the node
  setPins(){
    this.pins[0].position = new vec3(0, this.size.y * 0.5);
    this.pins[0].name = "in";
    this.pins[0].nameLocation = [-1, 1];

    this.pins[1].position = new vec3(this.size.x, this.size.y * 0.5);
    this.pins[1].name = "out";
    this.pins[1].nameLocation = [1, 1];
  }

  updateNode(){
    this.size = new vec3(this.node.params.width, this.node.params.height);
    this.setPins();
  }

}

// register the node using its metadata so the GUI can be updated
registerNode(PrinterNodeMetadata);
