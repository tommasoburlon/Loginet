let LoggerNodeMetadata, LoggerNodeMetaparams;

LoggerNodeMetaparams = {
  nInput : new Metaparameter(paramType.CONSTANT, 1, (val) => val == 1),
};

LoggerNodeMetadata = new NodeMetadata(
  "Logger Node",
  "misc",
  LoggerNodeMetaparams,
  (env) => new GLoggerNode(new LoggerNode(env)),
  "print to the console. the Packet that it receive"
);

class LoggerNode extends Node{
  constructor(env){
    super(env, LoggerNodeMetadata);

    this.metaparams = {
      nInput : new Metaparameter(paramType.INTEGER, 1, (val) => val == 1),
    };

    this.reset();
  }

  update(idx, pkt){
    console.log("new packet arrived, gate:", idx, " content: ", pkt, " global time: ", this.env.globalTime);
  }
}

class GLoggerNode extends GNode{
  constructor(_env, _node){
    super(_env, _node);

    this.size = new vec3(50.0, 50.0);
    this.position = new vec3(20.0, 20.0);
    this.setPins();
  }

  setPins(){
    this.pins[0].position = new vec3(0.0, 0.5 * this.size.y);
    this.pins[0].nameLocation = [-1, 1];
  }

  draw(cnv, ctx){
    ctx.beginPath();

    ctx.lineWidth = 1;
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.strokeStyle = "black";

    ctx.moveTo(0, 0);
    ctx.lineTo(this.size.x, 0);
    ctx.lineTo(this.size.x, this.size.y);
    ctx.lineTo(0, this.size.y);
    ctx.lineTo(0, 0);

    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0.1 * this.size.x, 0.1 * this.size.y);
    ctx.lineTo(0.9 * this.size.x, 0.1 * this.size.y);

    ctx.moveTo(0.1 * this.size.x, 0.2 * this.size.y);
    ctx.lineTo(0.9 * this.size.x, 0.2 * this.size.y);

    ctx.stroke();
  }
}

registerNode(LoggerNodeMetadata);
