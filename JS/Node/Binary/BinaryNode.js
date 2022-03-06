
class BinaryNode extends Node{
  constructor(_env, _metadata){
    super(_env, _metadata);

    this.state = {};

    this.lastInput = [];
  }

  // this handler is called when the node receive a packet
  update(gateIdx, pkt){
    //this.sendPacket(getOut, Packet, delay);

    if(!pkt.bin) return;

    if(this.lastInput[gateIdx] && this.lastInput[gateIdx].value == pkt.bin.value && this.lastInput[gateIdx].size == pkt.bin.size) return;

    this.newInput[gateIdx] = pkt.bin;

    console.log(this.lastInput[gateIdx], this.newInput[gateIdx]);

    this.updateCircuit(this.lastInput, this.newInput);

    this.lastInput[gateIdx] = this.newInput[gateIdx].clone();
  }

  updateCircuit(lastIn, input){

  }

  output(idx, _bin){
    this.sendPacket(idx + this.getNumberInput(), {bin : _bin}, this.params.delay);
  }


  initCircuit(){

  }

  // this handler is called at the start of the simulation
  init(){
    this.lastInput = new Array(this.getNumberInput());
    this.newInput  = this.lastInput.slice();

    this.initCircuit();
  }

  getNumberInput(){
    return (this.params.nInput || 0);
  }

  getNumberOutput(){
    return (this.params.nOutput || 0);
  }

  // should return the number of input/output link
  getNumberLinks(){
    return this.getNumberInput() + this.getNumberOutput();
  }

  // this handler is called when a collection is created or desctructed
  onLinkUpdate(idx){
    this.updateCircuit(this.lastInput, this.newInput);
  }
}
