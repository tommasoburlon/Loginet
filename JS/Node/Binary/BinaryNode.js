
class BinaryNode extends Node{
  static metadata = {
    name: "BinaryNode",
    path: "binary",
    desc: "base class for binary nodes",
    clone: () => null
  };

  static metaparams = {};

  constructor(){ super(); }

  /* implmentation abstract methods from Node class */
  onReceive(env, state, params, port, message){

    this.preInput.copy(this.input);
    this.input.copy(message.bits, this.inputOffset[port.id], this.getPortSize(port.id, params));

    this.preOutput.copy(this.output);
    state = this.onInput(state, params, this.preInput, this.input);

    let nIn = this.getNumberInput(params);
    let nOut = this.getNumberOutput(params);

    for(let i = 0; i < nOut; i++){
      let b0 = this.output.slice(this.outputOffset[i], this.getPortSize(i + nIn, params))
      let b1 = this.preOutput.slice(this.outputOffset[i], this.getPortSize(i + nIn, params))
      if(!b0.equals(b1))
        env.send(this.ports[i + nIn], {bits: this.output.slice(this.outputOffset[i], this.getPortSize(i + nIn, params))}, 0);
    }
    return state;
  }

  sendEvent(env, state, params, event){

    this.preOutput.copy(this.output);
    state = this.onEvent(state, params, this.input, event);

    let nIn = this.getNumberInput(params);
    let nOut = this.getNumberOutput(params);
    for(let i = 0; i < nOut; i++){
      let b0 = this.output.slice(this.outputOffset[i], this.getPortSize(i + nIn, params))
      let b1 = this.preOutput.slice(this.outputOffset[i], this.getPortSize(i + nIn, params))
      if(!b0.equals(b1))
        env.send(this.ports[i + nIn], {bits: this.output.slice(this.outputOffset[i], this.getPortSize(i + nIn, params))}, 0);
    }
    return state;
  }

  updateOutput(bits, port = 0){
    this.output.copy(bits, this.outputOffset[port], bits.size);
  }

  init(params){
    this.inputOffset = new Array(this.getNumberInput(params));
    this.outputOffset = new Array(this.getNumberOutput(params));

    let ctr, idx;

    ctr = 0;
    idx = 0;
    do{
      this.inputOffset[idx] = ctr;
      ctr += this.getPortSize(idx++, params);
    }while(idx < this.getNumberInput(params));
    this.input = new bitarray(ctr);
    this.preInput = new bitarray(ctr);

    ctr = 0;
    idx = 0;
    do{
      this.outputOffset[idx] = ctr;
      ctr += this.getPortSize(this.getNumberInput(params) + idx, params);
      idx++;
    }while(idx < this.getNumberOutput(params));
    this.output = new bitarray(ctr);
    this.preOutput = new bitarray(ctr);

    return this.initState(params);
  }

  onPortConnect(env, state, params, port){
    if(port.id >= this.getNumberInput(params)){
      let i = port.id - this.getNumberInput(params);
      env.send(port, {bits: this.output.slice(this.outputOffset[i], this.getPortSize(port.id, params))}, 0);
    }
  }

  onPortDisconnect(env, state, params, port){
    if(port.id < this.getNumberInput(params)){
      let out = new bitarray(this.getPortSize(port.id, params));
      for(let i = 0; i < out.size; i++) out.unset(i);
      env.sendToPort(port, {bits: out}, 0);
    }
  }

  getNumberPort(params){ return this.getNumberInput(params) + this.getNumberOutput(params); }

  /* abstract methods */
  onInput(state, params, preInput, input){}
  onEvent(state, params, input, event){}

  initState(params){ return undefined; }

  getNumberInput(params){ return 1;};
  getNumberOutput(params){ return 1;};
  getPortSize(idx, params){ return 1; }
}
