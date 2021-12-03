let paramType = {INTEGER : 0, FLOAT : 1, BOOLEAN : 2, CHAR : 3, ARRAY : 4, OBJECT : 5, CODE : 6, CONSTANT : 7};

class Metaparameter{
  constructor(_type, _def, _isOk){
    this.type = _type
    this.def = _def;
    this.isOk = _isOk;
  }
}

class NodeMetadata{
  constructor(name, category, metaparams, builder, desc = ""){
    this.name = name;
    this.builder = builder;
    this.category = category;
    this.metaparams = metaparams;
    this.desc = desc;
  }
};

class Link{
  constructor(_nodeIn = undefined, _idxIn = 0, _nodeOut = undefined, _idxOut = 0){
    this.n1 = _nodeIn;
    this.idx1 = _idxIn;
    this.n2 = _nodeOut;
    this.idx2 = _idxOut;
    this.exist = true;
  }
};

// class that contains the logic of one node
class Node{
  constructor(_env, _metadata){
    this.state = {};
    this.params = {};
    this.metadata = _metadata;
    this.env = _env;
    this.env.insertNode(this);

    this.loopback = new Link(this, -1, this, -1);
    this.links = [];
  }

  sendPacket(gateIdx, pkt, time = 0){
    this.env.sendPacket(this, gateIdx, pkt, time);
  }

  reset(){
    this.params = {};
    for(let i in this.metadata.metaparams)
      this.params[i] = this.metadata.metaparams[i].def;
    this.resetLinks();
  }

  reload(){
    this.resetLinks();
  }

  resetLinks(){
    for(let i in this.links){
      this.disconnect(i);
    }

    this.links = new Array((this.params.nInput || 0) + (this.params.nOutput || 0));

    for(let i in this.links)
      this.links[i] = undefined;
  }

  connect(idx, nodeOut, idxOut){
    this.links[idx] = new Link(this, idx, nodeOut, idxOut);
    nodeOut.links[idxOut] = this.links[idx];

    this.onLinkUpdate(idx);
    nodeOut.onLinkUpdate(idxOut);
  }

  disconnect(idx){
    if(!this.links[idx])
      return;

    let n1, n2, idx1, idx2;
    n1 = this.links[idx].n1;
    n2 = this.links[idx].n2;
    idx1 = this.links[idx].idx1;
    idx2 = this.links[idx].idx2;

    this.links[idx].exist = false;

    n1.links[idx1] = undefined;
    n2.links[idx2] = undefined;

    n1.onLinkUpdate(idx1);
    n2.onLinkUpdate(idx2);
  }

  update(gateIdx, pkt){

  }

  init(){

  }

  onLinkUpdate(idx){

  }

  getLinkedNode(idx){
    if(this.links[idx] && this.links[idx].exist){
      return this.links[idx].n1 == this ? this.links[idx].n2 : this.links[idx].n1;
    }
    return null;
  }
}

class Pin{
  constructor(_position, _parent, _name = "", _loc = [1, 1]){
    this.position = _position;
    this.parent = _parent;
    this.name = _name;
    this.nameLocation = _loc;
  }

  render(cnv, ctx){
    let pos;
    pos = this.getAbsPosition();

    ctx.beginPath();

    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.fillStyle = "rgb(0, 0, 0)";

    ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);

    ctx.stroke();
    ctx.fill();

    let w, h = 15, txtSize;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.font = h + "px Courier New";
    txtSize = ctx.measureText(this.name);
    w = txtSize.width;

    ctx.fillText(this.name,
      pos.x - 0.5 * w + this.nameLocation[0] * (5 + 0.5 * w),
      pos.y + 0.5 * h - this.nameLocation[1] * (5 + 0.5 * h)
    );
  }

  getAbsPosition(){
    return VMath.addv3(this.position, this.parent ? this.parent.position : new vec3());
  }
}

class GNode{
  constructor(_node){
    this.node = _node;
    this.position = new vec3(0, 0);
    this.size = new vec3(100, 100);

    this.pins = [];
    for(let i = 0; i < this.node.links.length; i++)
      this.pins.push(new Pin(new vec3(), this, "X_" + i, [1, 1]));

    this.metadata = _node.metadata;
  }

  draw(cnv, ctx){
    ctx.beginPath();

    ctx.lineWidth = 1;
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.strokeStyle = "black";

    ctx.moveTo(0, 0);
    ctx.lineTo(this.size.x, 0);
    ctx.lineTo(this.size.x, this.size.y);
    ctx.lineTo(0, this.size.y);
    ctx.lineTo(0, 0);

    ctx.stroke();
    ctx.fill();
  }

  render(cnv, ctx){

    ctx.translate(this.position.x, this.position.y);
    this.draw(cnv, ctx);
    ctx.translate(-this.position.x, -this.position.y);

    for(let o of this.pins)
      o.render(cnv, ctx, this);
  }

}

let nodesData = [];

function registerNode(_metadata){
  nodesData.push(_metadata);
}
