class GateNode extends BinaryNode{

  static type = {
    OR: "OR",
    AND: "AND",
    NOR: "NOR",
    NAND: "NAND",
    XOR: "XOR",
    XNOR: "XNOR"
  };

  static metadata = {
    name: "Gate Node",
    path: "binary",
    desc: "basic binary gate",
    clone: () => new GateGNode(new GateNode())
  };

  static metaparams = {
    ports: new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(5)
      .setDomainFunction(() => Domain.Any)
      .setName("input")
      .setDescription("number of input"),
    type: new Metaparam()
      .setType(Metaparam.type.ENUM)
      .setDefault(GateNode.type.XOR)
      .setDomainFunction(() => new FiniteDomain(GateNode.type))
      .setName("type")
      .setDescription("logic gate type")
  };

  onInput(state, params, preInput, input){
    let ctr = 0;
    for(let i = 0; i < params.ports; i++)
      ctr += input.get(i);
    let out = new bitarray(1);

    if(params.type == GateNode.type.OR || params.type == GateNode.type.NOR)
      out.setBit(0, ctr > 0);
    if(params.type == GateNode.type.AND || params.type == GateNode.type.NAND)
      out.setBit(0, ctr == params.ports);
    if(params.type == GateNode.type.XOR || params.type == GateNode.type.XNOR)
      out.setBit(0, ctr % 2 == 1);

    if(params.type == GateNode.type.NOR || params.type == GateNode.type.NAND || params.type == GateNode.type.XNOR)
      out.invert(0);

    this.updateOutput(out, 0);

    return state;
  }

  onEvent(state, params, input, event){}

  initState(params){ return undefined; }

  getNumberInput(params){ return params.ports;};
  getNumberOutput(params){ return 1;};
  getPortSize(idx, params){ return 1; }
}

class GateGNode extends DefaultGNode{
  constructor(n){ super(n); }

  onParamChange(params){ this.size = new vec2(100, 80 + 15 * params.ports); }
  onClick(env, state, params, pos){ return true; }
  onMouseMove(pos){}
  getPinPosition(idx, params){ return idx == params.ports ? new vec2(this.size.x, this.size.y * 0.5) : new vec2(0, this.size.y * (idx + 1) / (params.ports + 1))}
  getPinLabel(idx, params){ return idx == params.ports ? "out" : "in_" + idx;}
  getPinLabelLocation(idx, params){ return idx == params.ports ? [1, 1] : [-1, 1]; }

  draw(cnv, ctx, state, params){
    ctx.fillStyle = "rgb(220, 220, 220)";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    for(let i = 0; i < this.getNumberPins(params) - 1; i++){
      let pos = this.getPinPosition(i, params);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + this.size.x * 0.4, pos.y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(this.size.x, 0.5 * this.size.y);
    ctx.lineTo(this.size.x - this.size.x * 0.4, 0.5 * this.size.y);
    ctx.stroke();

    ctx.save();

    if(params.type == GateNode.type.AND || params.type == GateNode.type.NAND){
      ctx.beginPath();
      ctx.moveTo(0.5 * this.size.x, 0);
      ctx.lineTo(0.2 * this.size.x, 0);
      ctx.lineTo(0.2 * this.size.x, this.size.y);
      ctx.lineTo(0.5 * this.size.x, this.size.y);
      ctx.bezierCurveTo(this.size.x, this.size.y, this.size.x, 0, 0.5 * this.size.x, 0);
      ctx.stroke();
      ctx.fill();
    }

    if(params.type == GateNode.type.OR || params.type == GateNode.type.NOR){
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(0.3 * this.size.x, this.size.y * 0.2, 0.3 * this.size.x, this.size.y * 0.8, 0, this.size.y);
      ctx.bezierCurveTo(0.5 * this.size.x, this.size.y, 0.6 * this.size.x, this.size.y, this.size.x, 0.5 * this.size.y);
      ctx.bezierCurveTo(0.6 * this.size.x, 0, 0.5 * this.size.x, 0, 0, 0);
      ctx.stroke();
      ctx.fill();
    }

    if(params.type == GateNode.type.XOR || params.type == GateNode.type.XNOR){
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

    if(params.type == GateNode.type.XOR || params.type == GateNode.type.XNOR)
      ctx.fillText(params.type, this.size.x * 0.3, this.size.y * 0.5);
    else
      ctx.fillText(params.type, this.size.x * 0.25, this.size.y * 0.5);
    ctx.restore();
  }
}
