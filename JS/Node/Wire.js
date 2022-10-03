class Wire{
  constructor(pos = new vec2(0, 0)){
    this.position = new vec2(0, 0);
    this.start = new Pin().setPosition(pos).setWire(this);
    this.end = new Pin().setPosition(pos).setWire(this);
    this.points = [];
    this.color = "black";
  }

  render(cnv, ctx){
    let pt;

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;

    pt = this.start.getAbsPosition();
    ctx.moveTo(pt.x, pt.y)

    for(let pt of this.points)
      ctx.lineTo(pt.x, pt.y);

    pt = this.end.getAbsPosition();
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    if(!this.start.port) this.start.render(cnv, ctx);
    if(!this.end.port) this.end.render(cnv, ctx);
  }

  getPin(position){
    if(this.start.isInside(position))
      return this.start;
    if(this.end.isInside(position))
      return this.end;
    return null;
  }

  disconnect(env, pin){
    if(pin == this.start || pin == this.end){
      if(pin.port){
        pin.onMessageSent = function(env, message, recvTime){};
        pin.onMessageArrived = function(env, message, sendTime){};
      }
      pin.disconnect(env);
      pin.setWire(undefined);
      let new_pin = new Pin().setPosition(pin.getAbsPosition()).setWire(this);

      if(this.start == pin)
        this.start = new_pin;
      if(this.end == pin)
        this.end = new_pin;
      return new_pin;
    }
    return null;
  }

  connect(env, wire_pin, pin){
    if((wire_pin == this.start && pin != this.end) || (wire_pin == this.end && pin != this.start)){
      pin.setWire(this);
      if(wire_pin == this.start){
        this.start = pin;
        this.start.connect(env, this.end);
      }
      if(wire_pin == this.end){
        this.end = pin;
        this.end.connect(env, this.start);
      }
      pin.port.onMessageSent = function(env, message, recvTime){};
      pin.port.onMessageArrived = function(env, message, sendTime){};
      return pin;
    }

    return null;
  }

}
