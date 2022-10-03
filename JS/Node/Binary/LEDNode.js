
class LedNode extends BinaryNode{

  static metadata = {
    name: "LED",
    path: "binary",
    desc: "output led",
    clone: () => new LedGNode(new LedNode())
  };

  static metaparams = {
    ports: new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(5)
      .setDomainFunction(() => Domain.Any)
      .setName("leds")
      .setDescription("number of leds")
  };

  constructor(){ super(); }

  onInput(state, params, preInput, input){  state.leds.copy(input); }

  initState(params){
    let state = { leds : new bitarray(params.ports) }
    for(let i = 0; i < state.leds.size; i++){
      state.leds.unset(i);
    }
    return state;
  }

  getNumberInput(params){ return params.ports;};
  getNumberOutput(params){ return 0;};
  getPortSize(idx, params){ return 1; }
}


class LedGNode extends DefaultGNode{
  constructor(node){ super(node); }

  /* implmentation abstract methods from GNode class */
  onParamChange(params){ this.size = new vec2(50, params.ports * 50); this.margin = 10; }
  onClick(env, state, params, pos){ return true; }

  onMouseMove(pos){}
  getPinPosition(idx, params){ return new vec2(0, this.size.y * (idx + 0.5) / (params.ports)); }
  getPinLabel(idx, params){return "in_" + idx; }
  getPinLabelLocation(idx, params){ return [-1, 1]}
  draw(cnv, ctx, state, params){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "rgb(150, 150, 150)";

    ctx.beginPath();
    ctx.rect(0, 0, this.size.x, this.size.y);
    ctx.fill();
    ctx.stroke();

    let margin = this.margin;
    for(let i = 0; i < params.ports; i++){
      ctx.fillStyle = state.leds.get(i) ? "yellow" : "black";

      ctx.beginPath();
      ctx.arc(this.size.x * 0.5, (i + 0.5) * this.size.y / (params.ports), 0.5 * (this.size.x - 2 * margin), 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }

}
