
class ButtonNode extends BinaryNode{

  static metadata = {
    name: "Binary Button",
    path: "binary",
    desc: "input buttons",
    clone: () => new ButtonGNode(new ButtonNode())
  };

  static metaparams = {
    ports: new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(5)
      .setDomainFunction(() => Domain.Any)
      .setName("ports")
      .setDescription("number of buttons")
  };

  constructor(){ super(); }

  onInput(state, params, preInput, input){}
  onEvent(state, params, input, event){
    state.buttons.invert(event.id);
    this.updateOutput(state.buttons.slice(event.id, 1), event.id);
  }

  initState(params){
    let state = { buttons : new bitarray(params.ports) }
    for(let i = 0; i < state.buttons.size; i++){
      state.buttons.unset(i);
    }
    return state;
  }

  getNumberInput(params){ return 0;};
  getNumberOutput(params){ return params.ports;};
  getPortSize(idx, params){ return 1; }
}


class ButtonGNode extends DefaultGNode{
  constructor(node){ super(node); }

  /* implmentation abstract methods from GNode class */
  onParamChange(params){ this.size = new vec2(50, params.ports * 50); this.margin = 10; }
  onClick(env, state, params, pos){
    let margin = this.margin;

    for(let i = 0; i < params.ports; i++){
      if(pos.x > margin && pos.x < this.size.x - margin){
        if(pos.y > margin + i * this.size.y / params.ports && pos.y < (i + 1) * this.size.y / params.ports - margin){
          this.node.sendEvent(env, state, params, {id: i});
          return false;
        }
      }
    }
    return true;
  }

  onMouseMove(pos){}
  getPinPosition(idx, params){ return new vec2(this.size.x, this.size.y * (idx + 0.5) / (params.ports)); }
  getPinLabel(idx, params){return "out_" + idx; }
  getPinLabelLocation(idx, params){ return [1, 1]}
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
      ctx.fillStyle = state.buttons.get(i) ? "yellow" : "black";

      ctx.beginPath();
      ctx.rect(margin, margin + i * this.size.y / params.ports, this.size.x - 2 * margin, this.size.y / params.ports - 2 * margin);
      ctx.fill();
      ctx.stroke();
    }
  }

}
