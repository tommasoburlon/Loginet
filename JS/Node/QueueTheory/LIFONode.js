let LIFONodeMetadata, LIFONodeMetaparams;

LIFONodeMetaparams = {
  queueSize       : new Metaparameter(paramType.INTEGER, 10, (val) => val >= 1, (params) => !params.isInfinite),
  isInfinite      : new Metaparameter(paramType.BOOLEAN, true, (val) => true),
  isDeterministic : new Metaparameter(paramType.BOOLEAN, false, (val) => true),
  lambda          : new Metaparameter(paramType.FLOAT, 1 / 100, (val) => val > 0, (params) => !params.isDeterministic)
};

LIFONodeMetadata = new NodeMetadata(
  "LIFO Queue",
  "Queue Theory",
  LIFONodeMetaparams,
  (env) => new GLIFONode(new LIFONode(env)),
  "LIFO queue"
);

class LIFONode extends Node{
  constructor(_env){
    super(_env, LIFONodeMetadata);

    this.queue = new stack();

    this.reset();
  }

  getNumberLinks(){ return this.params.isDeterministic ? 3 : 2; }

  update(gateIdx, pkt){
    if(gateIdx == 0 && (this.queue.size() < this.params.queueSize || this.params.isInfinite)){
      this.queue.push(pkt);
    }else if(gateIdx == -1 || gateIdx == 2){
      if(!this.queue.empty() && this.getLinkedNode(1))
        this.sendPacket(1, this.queue.pop(), 0);

      if(!this.params.isDeterministic)
        this.sendPacket(-1, {}, - Math.log(1 - Math.random()) / this.params.lambda);
    }
  }

  init(){
    this.queue = new stack();

    if(!this.params.isDeterministic)
      this.sendPacket(-1, {}, - Math.log(1 - Math.random()) / this.params.lambda);
  }

  onLinkUpdate(idx){
  }
}

class GLIFONode extends GNode{
  constructor(_node){
    super(_node);

    this.size = new vec3(100, 200);
    this.setPins();
  }

  setPins(){
    let ratio = 0.75;

    this.pins[0].position = new vec3(0, 0);
    this.pins[0].nameLocation = [1, 1];
    this.pins[0].name = "in";

    this.pins[1].position = new vec3(this.size.x, 0);
    this.pins[1].nameLocation = [-1, 1];
    this.pins[1].name = "out";

    if(this.pins.length > 2){
      this.pins[2].position = new vec3(this.size.x - 0.1 * (1 - ratio) * this.size.y, 0.6 * (1 - ratio) * this.size.y);
      this.pins[2].nameLocation = [1, 1];
      this.pins[2].name = "send";
    }
  }

  draw(cnv, ctx){
    let ratio = 0.75;

    ctx.fillStyle = "rgb(230, 230, 230)";
    ctx.strokeStyle = "black";

    ctx.beginPath();
    ctx.rect(0, (1 - ratio) * this.size.y, this.size.x, ratio * this.size.y);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.size.x - 0.5 * (1 - ratio) * this.size.y, 0.6 * (1 - ratio) * this.size.y, 0.4 * (1 - ratio) * this.size.y, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.size.x * 0.25, 0);
    ctx.lineTo(this.size.x * 0.25, 0.25 * this.size.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.size.x, 0);
    ctx.lineTo(this.size.x * 0.75, 0);
    ctx.lineTo(this.size.x * 0.75, 0.2 * (1 - ratio) * this.size.y);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = Math.floor(0.6 * (1 - ratio) * this.size.y) + "px Courier New";
    let txtSize = ctx.measureText("\u{03BB}");
    ctx.fillText("\u{03BB}", this.size.x - 0.5 * (1 - ratio) * this.size.y - txtSize.width * 0.4, 0.6 * (1 - ratio) * this.size.y + 0.4 * (1 - ratio) * this.size.x);

    if(!this.node.params.isInfinite){
      ctx.fillStyle = "yellow";
      ctx.fillRect(0, this.size.y, this.size.x, -ratio * this.size.y * this.node.queue.size() / this.node.params.queueSize);

      let cols = 6;
      for(let i = 1; i < cols; i++){
        ctx.beginPath();
        ctx.moveTo(0, Math.floor((i / cols) * ratio * this.size.y + (1 - ratio) * this.size.y));
        ctx.lineTo(this.size.x, Math.floor((i / cols) * ratio * this.size.y + (1 - ratio) * this.size.y));
        ctx.stroke();
      }
    }else{
      ctx.font = Math.floor(this.size.x) + "px Courier New";
      let txtSize = ctx.measureText("\u{221E}");
      ctx.fillText("\u{221E}", 0.5 * this.size.x - 0.5 * txtSize.width, 0.75 * this.size.y);
    }

  }
}

registerNode(LIFONodeMetadata);
