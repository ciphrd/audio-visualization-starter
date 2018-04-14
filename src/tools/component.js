/**
 * Abstract component class 
 * A Component is a renderer html element with custom properties 
 * This is a light implementation so that the code looks cleaner 
 * in User Selection
 */

export class Component
{
  constructor()
  {
    this.dom = document.createElement("div");
    this.html = "";
  }

  addListener( evtName, callback )
  {
    this.dom.addEventListener( evtName, callback );
  }
};