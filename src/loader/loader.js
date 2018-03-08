/**
 * Simple loader
 */
export class Loader
{
  constructor()
  {
    document.body.innerHTML+= `<div id="loader"><div class="loading-text">LOADING</div></div>`;
    this.domElement = document.getElementById("loader");
    setTimeout(()=>{
      this.domElement.classList.add("loading");
    }, 10);
  }

  loaded()
  {
    this.domElement.classList.remove('loading');
    this.domElement.classList.add('loaded');
    setTimeout(()=>{
      this.domElement.remove();
    }, 1000);
  }
};