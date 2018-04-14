import { Component } from '../../tools/component';



export class ItemComponent extends Component
{
  /**
   * 
   * @param {string} icon the filename of the icon
   * @param {string} text the text to display underneath
   * @param {Array.<string>} classes array of the classes applied to the 
   */
  constructor( icon, text, classes )
  {
    super();
  
    this.dom.setAttribute("class", `track ${classes.reduce((a,b)=>a+" "+b)}`);
    this.html = `<div class="icon image" style="background-image: url(./dist/img/icons/${icon});"></div><div class="info-text">${text}</div>`;
    this.dom.innerHTML = this.html;
  }
};