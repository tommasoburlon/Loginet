class Metaparam{

  static type = {
    INTEGER : 0,
    FLOAT : 1,
    BOOLEAN : 2,
    CHAR : 3,
    ARRAY : 4,
    OBJECT : 5,
    CODE : 6,
    CONSTANT : 7,
    ENUM : 8
  };

  constructor(){
    this.name = undefined;
    this.description = undefined;
    this.type = undefined;
    this.default = undefined;
    this.getDomain = (params) => Domain.Any;
  }

  setType(_type){ this.type = _type; return this; }
  setDefault(_default){ this.default = _default; return this; }
  setDomainFunction(domain){ this.getDomain = domain; return this; }
  setName(_name){ this.name = _name; return this; }
  setDescription(_description){ this.description = _description; return this; }

  checkValue(value, params){
    let domain = this.getDomain(params);
    //console.log(this.name, value, domain, domain.len())
    return domain.len() == 0 || domain.contains(value);
  }
}

class Port{
  constructor(parent, id){
    this.id = id;
    this.parent = parent;
    this.linked = undefined;
  }

  isLinked(){ return this.linked !== undefined; }
  connect(env, port){
    this.linked = port;
    port.linked = this;
    if(env){
      this.parent.onPortConnect(env, this.parent.getState(), this.parent.getParams(), this);
      port.parent.onPortConnect(env, port.parent.getState(), port.parent.getParams(), port)
    }
  }
  disconnect(env){
    if(!this.isLinked()) return;
    let port = this.linked;
    this.linked.linked = undefined;
    this.linked = undefined;
    if(env){
      this.parent.onPortDisconnect(env, this.parent.getState(), this.parent.getParams(), this);
      port.parent.onPortDisconnect(env, port.parent.getState(), port.parent.getParams(), port);
    }
  }
  getLinked(){ return this.linked; }

  onMessageSent(env, message, recvTime){}
  onMessageArrived(env, message, sendTime){}
};

// class that contains the logic of one node
class Node{

  static metaparams = {
  };

  static metastate = {
  };

  static metadata = {
    name: "Node",
    path: "",
    desc: "base class for nodes",
    clone: () => new GNode(new Node())
  };

  constructor(){
    this.state = {};

    this.loopback = new Port(this, -1);
    this.loopback.connect(null, this.loopback);

    this.params = {};
    for(let i in this.constructor.metaparams)
      this.params[i] = this.constructor.metaparams[i].default;
    this.ports = [];
    this.reloadPorts();

    this.state = this.init(this.getParams());
  }

  getState(){ return this.state; }
  getParams(){ return this.params; }

  updateParams(env, params){
    for(let i in this.params)
      params[i] = params[i] === null ? this.params[i] : params[i];

    if(!this.checkParams(params))
      return false;

    for(let port of this.ports)
      port.disconnect(env);

    for(let i in params)
      this.params[i] = params[i];
    this.reloadPorts();

    this.state = this.init(this.getParams());
    return true;
  }


  checkParams(params){
    for(let name in this.constructor.metaparams){
      let m = this.constructor.metaparams[name];
      if(!m.checkValue(params[name], params))
        return false;
    }
    return true;
  }

  reloadPorts(){
    this.ports = [];
    for(let i = 0; i < this.getNumberPort(this.getParams()); i++){
      this.ports.push(new Port(this, i));
    }
  }


  receive(env, port, message){ this.onReceive(env, this.getState(), this.getParams(), port, message); }

  start(env){ this.onStart(env, this.getState(), this.getParams())}

  init(params){ return this.initState(params); }
  /* abstract methods */
  onStart(env, state, params){ }
  onReceive(env, state, params, port, message){ return state; }
  initState(params){ return {}; }
  onPortConnect(env, state, params, port){}
  onPortDisconnect(env, state, params, port){}
  getNumberPort(params){ return 1; }
}

/*
  GRAPHICS REPRESENTATIONS OF PORTS AND NODE
*/

class Pin{
  constructor(){
    this.position = new vec2(0, 0);
    this.node = null;
    this.wire = null;
    this.port = undefined;
    this.label = "";
    this.labelLocation = [1, 1];
    this.color = "black";
    this.labelColor = "black";
    this.radius = 5;

    this.connected = undefined;
  }

  connect(env, pin){
    if(pin.port && this.port){
      pin.port.connect(env, this.port);
      pin.connected = this;
      this.connected = pin;
    }
  }

  disconnect(env){
    if(this.connected){
      this.connected.connected = undefined;
      this.connected.disconnect(env);
      this.connected = undefined;
    }
    if(this.port){
      this.port.disconnect(env);
    }


  }

  setPosition(pos){ this.position.copy(pos); return this; }
  setLabel(label){ this.label = label; return this; }
  setColor(color){ this.color = color; return this; }
  setLabelColor(color){ this.labelColor = color; return this; }
  setRadius(radius){ this.radius = radius; return this; }
  setLabelLocation(location){ this.labelLocation = location; return this; }
  setNode(node){ this.node = node; return this; }
  setWire(wire){ this.wire = wire; return this; }
  setPort(port){this.port = port;return this; }

  render(cnv, ctx){
    let pos = this.position;

    ctx.fillStyle = this.color;
    ctx.lineWidth = 1;

    if(!this.node || !this.wire ){
      ctx.strokeStyle = "rgba(0,0,0,0)";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }else{
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      let diag = Math.sqrt(2) * this.radius * 0.7;
      ctx.beginPath();
      ctx.moveTo(pos.x + diag, pos.y + diag);
      ctx.lineTo(pos.x - diag, pos.y - diag);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pos.x - diag, pos.y + diag);
      ctx.lineTo(pos.x + diag, pos.y - diag);
      ctx.stroke();
    }

    let w, h = 15, txtSize;
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.fillStyle = this.labelColor;
    ctx.font = h + "px Courier New";
    txtSize = ctx.measureText(this.label);
    w = txtSize.width;

    ctx.fillText(this.label,
      this.position.x - 0.5 * w + this.labelLocation[0] * (5 + 0.5 * w),
      this.position.y + 0.5 * h - this.labelLocation[1] * (5 + 0.5 * h)
    );
  }

  getAbsPosition(){
    return (this.node) ? V2Math.add(this.position, this.node.position) : this.position;
  }

  isInside(pos){ return V2Math.distance(pos, this.getAbsPosition()) < this.radius; }
}

class GNode{
  constructor(_node){
    this.node = _node;
    this.position = new vec2(0, 0);
    this.size = new vec2(50, 50);

    this.pins = [];

    this.onParamChange(this.getParams());
    this.reloadPins();
  }

  move(dir){ this.position.add(dir); }
  setPosition(pos){ this.position.copy(pos); }

  getMetaparams(){ return this.node.constructor.metaparams; }
  getMetadata(){ return this.node.constructor.metadata; }
  getParams(){ return this.node.getParams(); }
  getState(){ return this.node.getState(); }
  setState(state){ this.node.state = state; }
  getNumberPins(params){ return this.node.getNumberPort(params); }

  updateParams(env, params){
    let ret = this.node.updateParams(env, params);
    if(!ret)
      return false;
    this.onParamChange(params);

    let prePin = [], preConnect = [];
    for(let pin of this.pins){
      preConnect.push(pin.connected);
      pin.position = pin.getAbsPosition();
      pin.setLabel("");
      pin.setNode(undefined);
      pin.setPort(undefined);
      pin.disconnect(env);
      prePin.push(pin);
    }

    this.reloadPins();

    for(let i in this.pins){
      if(prePin[i] && prePin[i].wire && V2Math.distance(this.pins[i].getAbsPosition(), prePin[i].position) < 3){
        prePin[i].position = this.pins[i].position;
        prePin[i].setLabel(this.pins[i].label);
        prePin[i].setNode(this);
        prePin[i].setPort(this.pins[i].port);
        this.pins[i] = prePin[i];

        prePin[i].wire.connect(env, prePin[i], this.pins[i]);
      }
    }
    return true;
  }

  reloadPins(){
    this.pins = [];
    let params = this.getParams();
    for(let idx = 0; idx < this.node.ports.length; idx++){
      this.pins.push( new Pin()
        .setPosition(this.getPinPosition(idx, params))
        .setLabel(this.getPinLabel(idx, params))
        .setLabelLocation(this.getPinLabelLocation(idx, params))
        .setPort(this.node.ports[idx])
        .setNode(this)
      );
    }
  }


  render(cnv, ctx){
    ctx.translate(this.position.x, this.position.y);

    this.baseRender(cnv, ctx, this.getState(), this.getParams());

    ctx.translate(-this.position.x, -this.position.y);
  }

  baseRender(cnv, ctx, state, params){

    if(false){
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "red";
      ctx.rect(0, 0, this.size.x, this.size.y);
      ctx.stroke();
    }

    this.draw(cnv, ctx, state, params);
    for(let o of this.pins)
      o.render(cnv, ctx, this);

  }

  disconnectPin(env, pinIdx){
    this.node.disconnect(env, pinIdx);

    let prePin = this.pins[pinIdx];
    this.pins[pinIdx] = new Pin(
      new vec3(prePin.position.x, prePin.position.y),
      this,
      prePin.name,
      prePin.nameLocation
    );
    prePin.name = "";
    prePin.position = prePin.getAbsPosition();
    prePin.parent = undefined;
  }

  disconnectAll(env){
    for(let i = 0; i < this.pins.length; i++)
      this.disconnectPin(env, i);
  }

  getPin(pos){
    for(let pin of this.pins){
      if(pin.isInside(pos))
        return pin;
    }
    return null;
  }

  isInside(pos){ return this.isPointInside(V2Math.sub(pos, this.position)); }

  click(env, pos){
    return this.onClick(env, this.getState(), this.getParams(), V2Math.sub(pos, this.position));
  }

  /* abstract methods */
  onParamChange(params){}
  onClick(env, state, params, pos){ return true; }
  onMouseMove(pos){}
  getPinPosition(idx, params){}
  getPinLabel(idx, params){}
  getPinLabelLocation(idx, params){}
  isPointInside(pos){}
  draw(cnv, ctx, state, params){}
}

class DefaultGNode extends GNode{
  constructor(node){
    super(node);
  }

  onParamChange(params){ this.size = new vec2(100, 100); }
  getPinPosition(idx, params){ return new vec2(this.size.x, this.size.y * (idx + 1) / (this.getNumberPort() + 1)); }
  getPinLabel(idx, params){ return "p_" + idx; }
  getPinLabelLocation(idx, params){ return [1, 1]; }
  isPointInside(pos){ return pos.x >= 0 && pos.y >= 0 && pos.x <= this.size.x && pos.y <= this.size.y; }

  draw(cnv, ctx, state, params){
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "rgb(150, 150, 150)";

    ctx.beginPath();
    ctx.rect(0, 0, this.size.x, this.size.y);
    ctx.fill();
    ctx.stroke();
  }

}
