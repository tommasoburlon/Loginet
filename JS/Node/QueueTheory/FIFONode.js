let FIFONodeMetadata, FIFONodeMetaparams;

FIFONodeMetaparams = {
  nInput          : new Metaparameter(paramType.CONSTANT, 1, (val) => val == 1),
  nOutput         : new Metaparameter(paramType.CONSTANT, 1, (val) => val == 1),
  queueSize       : new Metaparameter(paramType.INTEGER, 10, (val) => val >= 1),
  isInfinite      : new Metaparameter(paramType.BOOLEAN, true, (val) => true),
  isDeterministic : new Metaparameter(paramType.BOOLEAN, false, (val) => true),
  lambda          : new Metaparameter(paramType.FLOAT, 1 / 100, (val) => val > 0)
};

FIFONodeMetadata = new NodeMetadata(
  "FIFO Queue",
  "Queue Theory",
  FIFONodeMetaparams,
  (env) => new GFIFONode(new FIFONode(env)),
  "FIFO queue"
);

class FIFONode extends Node{
  constructor(_env){
    super(_env, FIFONodeMetadata);

    this.queue = new queue();

    this.reset();
  }

  update(gateIdx, pkt){
    if(gateIdx == 0 && (this.queue.size() < this.params.queueSize || this.params.isInfinite)){
      this.queue.push(pkt);
    }else if(gateIdx == -1){
      if(!this.queue.empty() && this.getLinkedNode(1))
        this.sendPacket(1, this.queue.pop(), 0);

      this.sendPacket(-1, {}, - Math.log(1 - Math.random()) / this.params.lambda);
    }
  }

  init(){
    this.queue = new queue();
    this.sendPacket(-1, {}, - Math.log(1 - Math.random()) / this.params.lambda);
  }

  onLinkUpdate(idx){
  }
}

class GFIFONode extends GNode{
  constructor(_node){
    super(_node);

    this.size = new vec3(200, 100);
    this.pins[0].position = new vec3(0,   50);
    this.pins[0].nameLocation = [-1, 1];
    this.pins[0].name = "in";

    this.pins[1].position = new vec3(200, 50);
    this.pins[1].nameLocation = [1, 1];
    this.pins[1].name = "out";
  }

  draw(cnv, ctx){
    ctx.fillStyle = "rgb(230, 230, 230)";
    ctx.strokeStyle = "black";

    let ratio = 0.75;

    ctx.beginPath();
    ctx.rect(0, 0, ratio * this.size.x, this.size.y);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0.5 * (1 + ratio) * this.size.x, 0.5 * this.size.y, 0.5 * (1 - ratio) * this.size.x, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = Math.floor(0.8 * (1 - ratio) * this.size.x) + "px Courier New";
    let txtSize = ctx.measureText("\u{03BB}");
    ctx.fillText("\u{03BB}", 0.5 * (1 + ratio) * this.size.x - txtSize.width * 0.5, 0.5 * this.size.y + 0.3 * (1 - ratio) * this.size.x);

    if(!this.node.params.isInfinite){
      ctx.fillStyle = "yellow";
      ctx.fillRect(ratio * this.size.x, 0, -(this.node.queue.size() / this.node.params.queueSize) * ratio * this.size.x, this.size.y);

      let cols = 6;
      for(let i = 1; i < cols; i++){
        ctx.beginPath();
        ctx.moveTo(Math.floor((i / cols) * ratio * this.size.x), 0);
        ctx.lineTo(Math.floor((i / cols) * ratio * this.size.x), this.size.y);
        ctx.stroke();
      }
    }else{
      ctx.font = Math.floor(this.size.y) + "px Courier New";
      let txtSize = ctx.measureText("\u{221E}");
      ctx.fillText("\u{221E}", 0.5 * ratio * this.size.x - 0.5 * txtSize.width, 0.75 * this.size.y);
    }
  }
}

registerNode(FIFONodeMetadata);
