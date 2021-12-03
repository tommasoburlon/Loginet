

class Sidemenu{
  constructor(){
    this.wrapper = document.createElement("DIV");
    this.wrapper.classList.add("sidemenuWrapper");

    this.showBtn = document.createElement("INPUT");
    this.showBtn.classList.add("sidemenuShowBtn")
    this.showBtn.id = "bellaaaa";
    this.showBtn.hidden = true;
    this.showBtn.type = "checkbox";

    this.btnLabel = document.createElement("LABEL");
    this.btnLabel.htmlFor = this.showBtn.id;
    this.btnLabel.classList.add("sidemenuShowBtnLabel");
    this.btnLabel.innerHTML = "<div><span>&#x27a4;</span></div>";

    this.content = document.createElement("DIV");
    this.content.classList.add("sidemenuBody");

    this.itemsTree = document.createElement("UL");
    this.itemsTree.classList.add("sidemenuCategory");

    this.wrapper.appendChild(this.showBtn);
    this.wrapper.appendChild(this.btnLabel);
    this.wrapper.appendChild(this.content);
    this.content.appendChild(this.itemsTree);
  }
  getHTML(){ return this.wrapper; }

  insertElement(path, html){
    let pathList, head = this.itemsTree, child;
    pathList = path.split("/");

    for(let i = 0; i < pathList.length - 1; i++){
      let safePath = pathList[i].replace(/ /g, "_");
      child = head.getElementsByClassName(safePath)[0];
      if(!child){
        let item, checkbox, label, retBtn, childWrapper;

        item = document.createElement("LI");
        checkbox = document.createElement("INPUT");
        checkbox.id = safePath + "_checkbox";
        checkbox.hidden = true;
        checkbox.type = "checkbox";

        label = document.createElement("LABEL");
        label.innerHTML = " <div class = 'sidemenuCategoryLabel'>" + pathList[i] + "</div>";
        label.htmlFor = checkbox.id;

        childWrapper = document.createElement("DIV");

        child = document.createElement("UL");
        child.classList.add("sidemenuCategory");
        child.classList.add(safePath);

        retBtn = document.createElement("LI");
        retBtn.innerHTML = "<label for = '" + checkbox.id + "'><div class = 'sidemenuCategoryLabel'> < " + pathList[i] + "</div></label>";

        item.appendChild(checkbox);
        item.appendChild(label);
        item.appendChild(childWrapper);
        childWrapper.appendChild(child);
        child.appendChild(retBtn);

        head.appendChild(item);
      }
      head = child;
    }

    head.appendChild(html);
    html.classList.add(path.replace(/ /g, "_"));
  }

}
