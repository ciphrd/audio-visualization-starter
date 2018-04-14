export class UserSelectionComponent
{
  constructor( dropHandler, hudKey = false )
  {
    this.dom = document.createElement("div");
    this.dom.setAttribute('id', "user-selection");

    this.html = `
    <div class="track-selection">
      <div class="cover"></div>
      <div class="top-info">Select the track you'd wish to visualize<br>or drop an audio file into the window</div>
      <div id="url-provider" class="closed">
        <input type="text" id="url-input"><!--
     --><div class="arrow">
          <div class="arrow-icon" style="background-image: url(./dist/img/icons/right-arrow.svg);"></div>
        </div>
      </div>
      <div class="tracks-container">
        <div class="tracks selection-items"></div>
        <div class="tracks selection-tracks hide"></div>
      </div>
    </div>
    <div class="cover"></div>`;

    if( hudKey != false )
      this.html+= `<div class="bottom-infos">During the visualization, you can toggle the HUD by pressing ${hudKey.toUpperCase()}</div>`;

    this.dom.ondragenter = (e) => { e.preventDefault(); };
    this.dom.ondragover = (e) => { e.preventDefault(); };
    this.dom.ondrop = (e) => {
      e.stopPropagation();
      e.preventDefault();
      dropHandler(e);
    };

    this.dom.innerHTML = this.html;

    this.itemsContainer = this.dom.getElementsByClassName( "selection-items" )[0];
    this.tracksContainer = this.dom.getElementsByClassName( "selection-tracks" )[0];
  }
};