
class LIFONode extends Node{
  constructor(_env){
    super(_env);

    this.metaparams = {
      nInput          : new Metaparameter(paramType.INTEGER, 1, (val) => val == 1),
      nOutput         : new Metaparameter(paramType.INTEGER, 1, (val) => val == 1),
      queueSize       : new Metaparameter(paramType.INTEGER, 10, (val) => val >= 1),
      isInfinite      : new Metaparameter(paramType.BOOLEAN, true, (val) => true),
      isDeterministic : new Metaparameter(paramType.BOOLEAN, false, (val) => true),
      lambda          : new Metaparameter(paramType.FLOAT, 1 / 100, (val) => val > 0)
    };
    this.queue = new stack();

    this.reset();
  }

  update(gateIdx, pkt){
    if(gateIdx == 0 && (this.queue.size() < this.params.queueSize || this.params.isInfinite)){
      this.queue.push(pkt);
    }else if(gateIdx == -1){
      if(!this.queue.empty() && this.getLinkedNode(1))
        this.sendPacket(1, this.queue.pop(), 0);

      this.sendPacket(-1, {}, - Math.log(1 - Math.random()) / this.params.lambda);
    }
  }

  init(){
    this.queue = new stack();
    this.sendPacket(-1, {}, - Math.log(1 - Math.random()) / this.params.lambda);
  }

  onLinkUpdate(idx){
  }
}

class GLIFONode extends GNode{
  constructor(_node){
    super(_node);
  }

  draw(cnv, ctx){

  }
}

registerNode(
  "LIFO queue",
  (env) => new GLIFONode(new LIFONode(env)),
  "Queue Theory",
  ""
);
