class MemoryNode extends BinaryNode{

  static type = {
    SR: "SR",
    D: "D",
    Dflipflop: "Dflipflop"
  };

  static metadata = {
    name: "Memory Node",
    path: "binary",
    desc: "basic memory gate",
    clone: () => new MemoryGNode(new MemoryNode())
  };

  static metaparams = {
    size: new Metaparam()
      .setType(Metaparam.type.INTEGER)
      .setDefault(1)
      .setDomainFunction(() => Domain.Any)
      .setName("size")
      .setDescription("size of input port"),
    type: new Metaparam()
      .setType(Metaparam.type.ENUM)
      .setDefault(MemoryNode.type.SR)
      .setDomainFunction(() => new FiniteDomain(MemoryNode.type))
      .setName("type")
      .setDescription("memory gate type")
  };

  onInput(state, params, preInput, input){
    for(let i = 0; i < params.size; i++){
      if(params.type == MemoryNode.type.SR){
        if(input.get(i)) state.memory.set(i);
        if(input.get(i + params.size)) state.memory.unset(i);
      }
      if(params.type == MemoryNode.type.D){
        if(input.get(params.size)) state.memory.setBit(i, input.get(i));
      }
      if(params.type == MemoryNode.type.Dflipflop){
        if(input.get(params.size) && !preInput.get(params.size)) state.memory.setBit(i, input.get(i));
      }
    }

    for(let i = 0; i < params.size; i++)
      state.memory.setBit(i + params.size, !state.memory.get(i));

    this.updateOutput(state.memory);

    return state;
  }

  onEvent(state, params, input, event){}

  initState(params){ return {memory: new bitarray(2 * params.size)}; }

  getNumberInput(params){ return 2;};
  getNumberOutput(params){ return 2;};
  getPortSize(idx, params){
    if(params.type == MemoryNode.type.SR) return params.size;
    return idx == 0 || idx == 2 || idx == 3 ? params.size : 1;
  }
}

class MemoryGNode extends DefaultGNode{
  constructor(n){ super(n); }

  onParamChange(params){ this.size = new vec2(150, 80); }
  onClick(env, state, params, pos){ return true; }
  onMouseMove(pos){}
  getPinPosition(idx, params){
    switch(idx){
      case 0: return new vec2(0, this.size.y * 0.3);
      case 1: return new vec2(0, this.size.y * 0.7);
      case 2: return new vec2(this.size.x, this.size.y * 0.3);
      case 3: return new vec2(this.size.x, this.size.y * 0.7);
    }
  }
  getPinLabel(idx, params){
    let size = params.size;

    if(idx == 2) return "out[" + size + "]";
    if(idx == 3) return "~out[" + size + "]";
    if(params.type == MemoryNode.type.SR) return idx == 0 ? "set[" + size + "]" : "reset[" + size + "]";
    if(params.type == MemoryNode.type.D) return idx == 0 ? "data[" + size + "]" : "enable";
    if(params.type == MemoryNode.type.Dflipflop) return idx == 0 ? "data[" + size + "]" : "clock";
  }

  getPinLabelLocation(idx, params){ return [idx < 2 ? 1 : -1, idx % 2 == 0 ? 1 : -1]; }

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
