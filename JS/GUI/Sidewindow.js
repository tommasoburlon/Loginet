class Sidewindow{
  constructor(){
    this.wrapper = document.createElement("DIV");
    this.wrapper.classList.add("sidewindowWrapper");
    this.wrapper.classList.add("sidewindowWrapperClose");

    this.content = document.createElement("DIV");
    this.content.classList.add("sidewindow");
    this.content.classList.add("sidewindowClose");

    this.wrapper.appendChild(this.content);
  }

  getHTML(){
    return this.wrapper;
  }

  open(){
    this.wrapper.classList.replace("sidewindowWrapperClose", "sidewindowWrapperOpen");
    this.content.classList.replace("sidewindowClose", "sidewindowOpen");
  }

  close(){
    this.wrapper.classList.replace("sidewindowWrapperOpen", "sidewindowWrapperClose");
    this.content.classList.replace("sidewindowOpen", "sidewindowClose");
  }
}
