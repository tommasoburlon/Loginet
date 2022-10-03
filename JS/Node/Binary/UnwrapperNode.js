class UnwrapperNode extends BinaryNode{

  static metadata = {
    name: "Unwrapper Node",
    path: "binary",
    desc: "unwrap a single input of great size into an single input output",
    clone: () => new UnwrapperGNode(new UnwrapperNode())
  };

  static metaparams = {
    outputs: new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(2)
      .setDomainFunction(() => Domain.Any)
      .setName("output")
      .setDescription("size of the input"),
  };

  onInput(state, params, preInput, input){
    this.updateOutput(input.clone());
    return state;
  }

  onEvent(state, params, input, event){}

  initState(params){ return undefined; }

  getNumberInput(params){ return 1;};
  getNumberOutput(params){ return params.outputs;};
  getPortSize(idx, params){
    return idx == 0 ? params.outputs : 1;
  }
}

class UnwrapperGNode extends DefaultGNode{
  constructor(n){ super(n); }

  onParamChange(params){ this.size = new vec2(20, 20 * params.outputs); }
  onClick(env, state, params, pos){ return true; }
  onMouseMove(pos){}
  getPinPosition(idx, params){ return idx == 0 ? new vec2(0, 0.5 * this.size.y) : new vec2(this.size.x, this.size.y * (idx - 1) / (params.outputs - 1)); }
  getPinLabel(idx, params){ return idx == 0 ? "in[" + params.outputs + "]" : "out_" + (idx - 1);}
  getPinLabelLocation(idx, params){ return idx == 0 ? [-1, 1] : [1, 1]; }

  draw(cnv, ctx, state, params){
    ctx.fillStyle = "rgb(220, 220, 220)";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.rect(0, 0, this.size.x, this.size.y);
    ctx.stroke();
    ctx.fill();
  }
}
