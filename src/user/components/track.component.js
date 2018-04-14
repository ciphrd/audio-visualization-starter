import { Component } from '../../tools/component';



export class TrackComponent extends Component
{
  constructor( image, artist, name )
  {
    super();
  
    this.dom.setAttribute("class", `track`);
    this.html = `
    <div class="image" style="background-image: url(${image});"></div>
    <div class="track-infos">
      <span class="artist">${artist}</span> - <span class="track-name">${name}</span>
    </div>`;
    this.dom.innerHTML = this.html;
  }
};