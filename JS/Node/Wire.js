

class Wire{
  constructor(pos = new vec3()){
    this.link = new Link();

    this.start = new Pin(pos);
    this.end = new Pin(pos);
    this.points = [];
  }

  render(cnv, ctx){
    let pt;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";

    pt = this.start.getAbsPosition();
    ctx.moveTo(pt.x, pt.y)

    for(let pt of this.points)
      ctx.lineTo(pt.x, pt.y);

    pt = this.end.getAbsPosition();
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();

    this.start.render(cnv, ctx);
    this.end.render(cnv, ctx);
  }

  disconnectStart(){
    this.disconnectPins();
    this.start = new Pin(this.start.getAbsPosition());
    return this.start;
  }

  disconnectEnd(){
    this.disconnectPins();
    this.end = new Pin(this.end.getAbsPosition());
    return this.end;
  }

  connectStart(_pin){
    this.start = _pin;
    this.connectPins();
  }

  connectEnd(_pin){
    this.end = _pin;
    this.connectPins();
  }

  connectPins(){
    if(this.start.parent && this.end.parent){
      let n1 = this.start.parent, n2 = this.end.parent, idx1, idx2;
      idx1 = n1.pins.indexOf(this.start);
      idx2 = n2.pins.indexOf(this.end);
      n1.node.connect(idx1, n2.node, idx2);
    }
  }

  disconnectPins(){
    let n, idx, pin;

    pin = this.start.parent ? this.start : this.end;
    if(pin.parent){
      n = pin.parent;
      idx = n.pins.indexOf(pin);
      n.node.disconnect(idx);
    }
  }


}
