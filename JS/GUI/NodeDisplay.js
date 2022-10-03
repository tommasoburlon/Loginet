
class NodeDisplay{
  static html = `
    <canvas name = "nodeImage" style = "width: 200px; height: 200px; background-color: white"></canvas><br/>
    name = <span name = "nodeName"></span><br/>
    path = <span name = "nodePath"></span><br/>
    desc = <span name = "nodeDesc"></span><br/>
    <div name = "nodeParams">

    </div>

    <button name = "nodeSave"> save </button>
  `;

  static getObjectInput(params, meta, obj){
    let input, domain;
    domain = meta.getDomain(params);

    if(meta.type == Metaparam.type.INTEGER){
      input = document.createElement("input");
      input.style.width = "50px";
      input.type = "number";
      input.value = obj;
    }

    if(meta.type == Metaparam.type.ENUM){
      input = document.createElement("select");
      let options = domain.iter();
      for(let val in options){
        let option = document.createElement("option");
        option.value = options[val];
        option.textContent = val;
        input.appendChild(option);
      }
      input.value = obj;
    }

    if(meta.type == Metaparam.type.BOOLEAN){
      input = document.createElement("input");
      input.type = "checkbox";
      input.checked = obj;
    }

    if(input == null){
      input = document.createElement("input");
    }
    return input;
  }

  static retrieveInput(input, meta){
    if(meta.type == Metaparam.type.BOOLEAN)
      return input.checked
    if(meta.type == Metaparam.type.INTEGER)
      return parseInt(input.value);
    if(meta.type == Metaparam.type.FLOAT)
      return parseFloat(input.value);
    return input.value;
  }

  static updateInput(doms, metaparams, params){
    for(let name in metaparams){
      let domain = metaparams[name].getDomain(params);
      //console.log(name, metaparams[name])
      if(domain.len() == 0)
        doms[name].disabled = true;
      else
        doms[name].disabled = false;
    }
  }

  constructor(env){
    this.root = document.createRange().createContextualFragment(this.constructor.html);
    this.name = this.root.querySelector("*[name=nodeName]");
    this.desc = this.root.querySelector("*[name=nodeDesc]");
    this.path = this.root.querySelector("*[name=nodePath]");
    this.canvas = this.root.querySelector("*[name=nodeImage]");
    this.params = this.root.querySelector("*[name=nodeParams]");
    this.save = this.root.querySelector("*[name=nodeSave]")
    this.paramsValue = {};
    this.node = undefined;
    this.env = env;

    this.save.addEventListener("click", this.saveClick.bind(this));
  }

  saveClick(){
    let ret = this.node.updateParams(this.env, this.paramsValue);
  }

  draw(node, params){
    //draw node image
    let w, h, scale, ctx;

    w = 200;
    h = 200;
    this.canvas.width = w;
    this.canvas.height = h;

    scale = 0.8 * Math.min(w / node.size.x, h / node.size.y);
    ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    ctx.scale(scale, scale);
    ctx.translate(-0.5 * (node.size.x - w / scale), -0.5 * (node.size.y - h / scale))
    node.draw(this.canvas, ctx, node.getState(), params);
    for(let i = 0; i < node.getNumberPins(params); i++){
      let pin = new Pin()
        .setPosition(node.getPinPosition(i, params))
        .setLabel(node.getPinLabel(i, params))
        .setLabelLocation(node.getPinLabelLocation(i, params))
        .setNode(node)
        .render(this.canvas, ctx);
    }
    ctx.scale(1/scale, 1/scale);
  }

  load(node){
    this.node = node;
    this.paramsValue = {};

    //load basic information
    let metadata = node.getMetadata();
    this.name.textContent = metadata.name;
    this.desc.textContent = metadata.desc;
    this.path.textContent = metadata.path;


    this.draw(node, node.getParams());

    //load metaparam
    let metaparams = node.getMetaparams();
    let params = node.getParams();

    let inputDOMs = {};
    for(let name in metaparams){
      this.paramsValue[name] = params[name];

      let dom = this.constructor.getObjectInput(params, metaparams[name], params[name]);
      this.params.appendChild(dom);
      inputDOMs[name] = dom;
    }

    this.constructor.updateInput(inputDOMs, metaparams, this.paramsValue);

    for(let name in inputDOMs){
      let dom = inputDOMs[name];
      dom.addEventListener("change", function(evt){
        this.paramsValue[name] = this.constructor.retrieveInput(dom, metaparams[name]);
        this.constructor.updateInput(inputDOMs, metaparams, this.paramsValue);
        this.draw(node, this.paramsValue)
      }.bind(this));
    }

  }

  getRoot(){
    return this.root;
  }
}
