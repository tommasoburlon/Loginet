let componentType = {GNODE : 0, GNODE_PIN : 1, WIRE_START : 2, WIRE_END : 3};

function loadNode(sidewindow, node){
  sidewindow.open();

  while(sidewindow.content.firstChild)
    sidewindow.content.removeChild(sidewindow.content.firstChild);

  let cnv = document.createElement("CANVAS");
  cnv.style = "position:relative;width:200px;height:200px;background-color:white;top:20px;border:1px solid; margin:20px";
  cnv.width = 200;
  cnv.height = 200;

  sidewindow.content.appendChild(document.createTextNode(node.metadata.name));
  sidewindow.content.appendChild(document.createElement("BR"));
  sidewindow.content.appendChild(cnv);

  let preSize, prePos, scale, translation;
  preSize = new vec3(node.size.x, node.size.y);
  prePos = new vec3(node.position.x, node.position.y);

  scale = 150 / Math.max(node.size.x, node.size.y);
  node.size.x *= scale;
  node.size.y *= scale;

  node.position.x = 0.5 * (200 - node.size.x);
  node.position.y = 0.5 * (200 - node.size.y);

  node.render(cnv, cnv.getContext("2d"));

  node.size.x = preSize.x;
  node.size.y = preSize.y;
  node.position.x = prePos.x;
  node.position.y = prePos.y;

  sidewindow.content.appendChild(document.createElement("BR"));
  sidewindow.content.appendChild(document.createElement("BR"));
  sidewindow.content.appendChild(document.createTextNode(node.metadata.desc));

  for(let key in node.node.params){
    sidewindow.content.appendChild(document.createElement("BR"));
    sidewindow.content.appendChild(document.createTextNode(
      key + ":"
    ));

    let type = node.metadata.metaparams[key].type, input;
    if(type == paramType.CONSTANT){
      input = document.createTextNode(node.node.params[key]);
    }else if(type == paramType.INTEGER){
      input = document.createElement("INPUT");
      input.type = "number";
      input.value = node.node.params[key];
    }else if(type == paramType.BOOLEAN){
      input = document.createElement("INPUT");
      input.type = "checkbox";
      input.checked = node.node.params[key];
    }else if(type == paramType.FLOAT){
      input = document.createElement("INPUT");
      input.type = "text";
      input.value = node.node.params[key];
    }
    input.id = key;
    sidewindow.content.appendChild(input);
  }

  let saveBtn;
  saveBtn = document.createElement("A");
  saveBtn.classList.add("highlightText");
  saveBtn.appendChild(document.createTextNode("save"));
  saveBtn.addEventListener("click", () => {
    for(let key in node.node.params){
      let type = node.metadata.metaparams[key].type, input;
      input = document.getElementById(key);
      if(type == paramType.INTEGER){
        node.node.params[key] = parseInt(input.value);
      }else if(type == paramType.BOOLEAN){
        node.node.params[key] = input.checked;
      }else if(type == paramType.FLOAT){
        node.node.params[key] = parseFloat(input.value);
      }
      node.node.reload();
    }
    loadNode(sidewindow, node);
  });

  sidewindow.content.appendChild(document.createElement("BR"));
  sidewindow.content.appendChild(saveBtn);
}

class Component{
  constructor(type, value, base){
    this.value = value;
    this.type  = type;
    this.relPos  = base;
  }
}

class GUI{
  constructor(cnv, env){
    this.gnodes = [];
    this.wires = [];
    this.cnv = cnv;
    this.ctx = this.setupCanvas(cnv);
    this.env = env;

    this.mouse = {x : 0, y : 0, t : 0};

    this.selectedComponent = [];

    window.addEventListener("mousemove", this.mousemove.bind(this));
    this.cnv.addEventListener("mouseup",   this.mouseup.bind(this));
    this.cnv.addEventListener("mousedown", this.mousedown.bind(this));

    this.preT = new Date().getTime();
    this.interval = undefined;
  }

  render(){
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
    for(let i = this.gnodes.length - 1; i >= 0; i--)
      this.gnodes[i].render(this.cnv, this.ctx);
    for(let i = this.wires.length - 1; i >= 0; i--)
      this.wires[i].render(this.cnv, this.ctx);

    this.env.execute();

    window.requestAnimationFrame(function(){this.render()}.bind(this));
  }

  execute(){
    let t = new Date().getTime();
    this.env.globalTime += (t - this.preT);
    this.preT = t;
  }

  start(){
    if(this.interval)
      return;
    this.preT = new Date().getTime();
    this.env.reset();
    this.interval = setInterval(this.execute.bind(this), 0);
  }

  stop(){
    clearInterval(this.interval);
    this.interval = undefined;
  }

  insertNode(n){
    this.gnodes.push(n);
  }

  insertWire(w){
    this.wires.push(w);
  }

  setupCanvas(canvas) {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
  }

  getNode(position){
    for(let o of this.gnodes)
      if(o.position.x <= position.x && o.position.y <= position.y && o.position.x + o.size.x >= position.x && o.position.y + o.size.y >= position.y)
        return new Component(componentType.GNODE, o, null);
    return null;
  }

  getWirePin(position){
    let absPos;
    for(let w of this.wires){
      absPos = w.start.getAbsPosition();
      if((absPos.x - position.x) * (absPos.x - position.x) + (absPos.y - position.y) * (absPos.y - position.y) < 5 * 5)
        return new Component(componentType.WIRE_START, w, null);

      absPos = w.end.getAbsPosition();
      if((absPos.x - position.x) * (absPos.x - position.x) + (absPos.y - position.y) * (absPos.y - position.y) < 5 * 5)
        return new Component(componentType.WIRE_END, w, null);
    }
    return null;
  }

  getGNodePin(position){
    let absPos;
    for(let o of this.gnodes){
      for(let pt of o.pins){
        absPos = pt.getAbsPosition();
        if((absPos.x - position.x) * (absPos.x - position.x) + (absPos.y - position.y) * (absPos.y - position.y) < 5 * 5)
          return new Component(componentType.GNODE_PIN, pt, null);
      }
    }
    return null;
  }

  getPoint(position){
    return this.getWirePin(position) || this.getGNodePin(position);
  }

  mousemove(evt){
    let pos;
    pos = new vec3(evt.clientX, evt.clientY);
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;

    for(let o of this.selectedComponent){
      if(o.type == componentType.GNODE)
        o.value.position = VMath.subv3(pos, this.selectedComponent[0].relPos);

      if(o.type == componentType.WIRE_START){
        o.value.start.position = pos;
        let nearPin = this.getGNodePin(pos);
        if(nearPin){
          o.value.start.position = nearPin.value.getAbsPosition();
        }
      }
      if(o.type == componentType.WIRE_END){
        o.value.end.position = pos;
        let nearPin = this.getGNodePin(pos);
        if(nearPin){
          o.value.end.position = nearPin.value.getAbsPosition();
        }
      }
    }
  }

  mouseup(evt){
    let pos = new vec3(evt.clientX, evt.clientY);
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;

    if((new Date()).getTime() - this.mouse.t < 100){
      sidewindow.close();
      if(this.selectedComponent.length == 1 && this.selectedComponent[0].type == componentType.GNODE){
        loadNode(sidewindow, this.selectedComponent[0].value);
      }
    }

    for(let o of this.selectedComponent){
      if(o.type == componentType.WIRE_START){
        o.value.start.position = pos;
        let nearPin = this.getGNodePin(pos);
        if(nearPin){
          o.value.connectStart(nearPin.value);
        }
      }
      if(o.type == componentType.WIRE_END){
        o.value.end.position = pos;
        let nearPin = this.getGNodePin(pos);
        if(nearPin){
          o.value.connectEnd(nearPin.value);
        }
      }
    }

    this.selectedComponent = [];
  }

  mousedown(evt){
    let com, pos, basePos;
    pos  = new vec3(evt.clientX, evt.clientY);
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;
    this.mouse.t = new Date().getTime();

    com = this.getPoint(pos);
    if(com != null){
      if(com.type == componentType.WIRE_START || com.type == componentType.WIRE_END){
        if(com.type == componentType.WIRE_START)
          com.value.disconnectStart();
        else
          com.value.disconnectEnd();
        com.relPos = new vec3();
        this.selectedComponent = [com];
        return;
      }
      if(com.type == componentType.GNODE_PIN){
        let w = new Wire(com.value.getAbsPosition());
        this.insertWire(w);
        w.start = com.value;

        com.value = w;
        com.type = componentType.WIRE_END;
        com.relPos = new vec3();
        this.selectedComponent = [com];
        return;
      }
    }

    com = this.getNode(pos);
    if(com != null){
      com.relPos = VMath.subv3(pos, com.value.position);
      this.selectedComponent = [com];
    }
  }

}
