class LoggerNode extends Node{
  constructor(env){
    super(env);

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
    this.pins[0].position = new vec3(0.0, 25.0);
  }
}
