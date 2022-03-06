

class Wire{
  constructor(pos = new vec3()){
    this.link = new Link();

    this.start = new Pin(pos);
    this.end = new Pin(pos);
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

      this.link.onPacketTransit = function(){};
      this.link = n1.node.links[idx1];
      this.link.onPacketTransit = function(pkt){
        this.color = "black";
        this.start.color = "black";
        this.end.color = "black";
        if(pkt.bin && pkt.bin.get && pkt.bin.get(0)){
          this.color = "yellow";
          this.start.color = "yellow";
          this.end.color = "yellow";
        }
      }.bind(this);
    }
  }

  disconnectPins(){
    let n, idx, pin;

    this.start.color = "black";
    this.end.color = "black";
    this.color = "black";
    pin = this.start.parent ? this.start : this.end;
    if(pin.parent){
      n = pin.parent;
      idx = n.pins.indexOf(pin);
      n.node.disconnect(idx);
      this.link.onPacketTransit = function(){};
    }
  }


}
