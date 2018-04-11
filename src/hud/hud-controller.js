import AppConfig from '../config/app.config';
import { HUDElement } from '../tools/hud-element';


/**
 * Handles the elements from the HUD
 */
export class HUD
{
  /**
   * 
   * @param {...HUDElement} elements The elements you want to add to the HUD
   */
  constructor( ...elements )
  {
    /**
     * @type {Array.<HUDElement>}
     */
    this.elements = new Array();
    this.show = AppConfig.hudDisplayed;

    elements.forEach( elem => {
      this.add(elem);
    });

    document.addEventListener( "keydown", (event) => {
      this.keyDownEvent(event);
    });
  }


  /**
   * Adds an element to the HUD
   * @param {HUDElement} element the element MUST implement the method toggle()
   */
  add( element )
  {
    this.elements.push( element );
    element.toggle( this.show );
  }


  /**
   * 
   * @param {KeyboardEvent } event 
   */
  keyDownEvent( event )
  {
    if( event.key == AppConfig.hudToggleKey )
    {
      event.stopPropagation();
      this.show = !this.show;
      this.elements.forEach( elem => {
        elem.toggle( this.show );
      })
    }
  }
};