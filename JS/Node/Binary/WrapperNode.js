class WrapperNode extends BinaryNode{

  static metadata = {
    name: "Wrapper Node",
    path: "binary",
    desc: "wrap multiple input into an output with greater size",
    clone: () => new WrapperGNode(new WrapperNode())
  };

  static metaparams = {
    inputs: new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(2)
      .setDomainFunction(() => Domain.Any)
      .setName("input")
      .setDescription("number of input"),
  };

  onInput(state, params, preInput, input){
    this.updateOutput(input.clone());
    return state;
  }

  onEvent(state, params, input, event){}

  initState(params){ return undefined; }

  getNumberInput(params){ return params.inputs;};
  getNumberOutput(params){ return 1;};
  getPortSize(idx, params){
    return idx == params.inputs ? params.inputs : 1;
  }
}

class WrapperGNode extends DefaultGNode{
  constructor(n){ super(n); }

  onParamChange(params){ this.size = new vec2(20, 20 * params.inputs); }
  onClick(env, state, params, pos){ return true; }
  onMouseMove(pos){}
  getPinPosition(idx, params){ return idx == params.inputs ? new vec2(this.size.x, 0.5 * this.size.y) : new vec2(0, this.size.y * idx / (params.inputs - 1)); }
  getPinLabel(idx, params){ return idx == params.inputs ? "out[" + params.inputs + "]" : "in_" + idx;}
  getPinLabelLocation(idx, params){ return idx == params.inputs ? [1, 1] : [-1, 1]; }

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
