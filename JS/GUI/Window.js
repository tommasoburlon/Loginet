class Window{
  static html = `
    <div name = "windowWrapper" class = "windowWrapper">
      <div name = "windowBar">
        <div name = "windowTitle">title placeholder</div>
        <div name = "windowMinimize" class = "windowButton">_</div>
        <div name = "windowClose" class = "windowButton">x</div>
      </div>
      <div name = "windowContent">
      </div>
    </div>
  `;

  constructor(title = "placeholder"){
    this.root = document.createRange().createContextualFragment(this.constructor.html);
    this.window = this.root.querySelector("*[name=windowWrapper]");
    this.bar =  this.root.querySelector("*[name=windowBar]");
    this.content = this.root.querySelector("*[name=windowContent]");
    this.closeButton = this.root.querySelector("*[name=windowClose]");
    this.title = this.root.querySelector("*[name=windowTitle]");
    this.content = this.root.querySelector("*[name=windowContent]");

    this.listeners = {
      mousemove: this.mousemove.bind(this),
      mouseup: this.mouseup.bind(this),
      mousedown: this.mousedown.bind(this),
      close: this.close.bind(this)
    };
    document.body.addEventListener("mousemove", this.listeners.mousemove);
    document.body.addEventListener("mouseup", this.listeners.mouseup);
    this.bar.addEventListener("mousedown", this.listeners.mousedown);
    this.closeButton.addEventListener("click", this.listeners.close);

    this.select = false;
    this.relPos = {x: 0, y: 0};
    this.position = {x: 0, y: 0};
    this.size = {x: 0, y: 0};

    this.setTitle(title);
  }

  setPosition(position){
    this.position.x = position.x;
    this.position.y = position.y;
    this.window.style.left = position.x;
    this.window.style.top = position.y;
  }

  move(position){
    this.setPosition({x: position.x + this.position.x, y: position.y + this.position.y});
  }

  mousedown(evt){
    this.select = true;
    this.relPos.x = evt.clientX - this.position.x;
    this.relPos.y = evt.clientY - this.position.y;
  }

  mousemove(evt){
    if(!this.select)
      return;
    this.setPosition({
      x: evt.clientX - this.relPos.x,
      y: evt.clientY - this.relPos.y
    });
  }

  mouseup(evt){
    this.select = false;
  }

  close(){
    if(this.window.parentNode){
      this.window.parentNode.removeChild(this.window);
    }
  }

  open(parent){
    if(this.window.parentNode)
      this.close();
    parent.appendChild(this.window);
  }

  setTitle(str){
    this.title.innerHTML = str;
  }

  setContent(content){
    while(this.content.firstChild)
      this.content.removeChild(this.content.firstChild);
    this.content.appendChild(content);
  }
}
