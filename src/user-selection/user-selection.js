
/**
 * Handles the pre-selection
 */
export class UserSelection
{
  /**
   * Callback param 1: type of 
   * @param {*} callback The method to be called once the user has selected 
   */
  constructor( callback )
  {
    this.setupLoader();

    this.callback = callback;
    this.files = [];

    this.microphoneImg = new Image();
    this.microphoneImg.src = './dist/img/microphone.svg';

    this.loadLibraryFile().then( (library) => {
      
      library.forEach( (soundfile) => {
        this.files.push( new SoundFile(soundfile) );
      });
      this.loadCovers().then(()=>{ this.setupSelection(); });

    })
  }

  setupLoader()
  {
    document.body.innerHTML+= `<div id="loader"><div class="loading-text">LOADING LIBRARY</div></div>`;
    this.domElementLoader = document.getElementById("loader");
    setTimeout(()=>{
      this.domElementLoader.classList.add("loading");
    }, 10);
  }

  setupSelection()
  {
    this.domElementLoader.classList.remove('loading');
    this.domElementLoader.classList.add('loaded');
    setTimeout(()=>{
      this.domElementLoader.remove();
    }, 1000);

    this.domElement = document.createElement("div");
    this.domElement.setAttribute('id', "user-selection");
    this.domElement.innerHTML = `
    <div class="track-selection">
      <div class="top-info">Select the track you'd wish to visualize</div>
      <div class="tracks"></div>
    </div>
    <div class="bottom-infos">Duing the visualization, you can toggle the HUD by pressing H</div>`;

    this.domElement.ondragenter = (e) => { e.preventDefault(); };
    this.domElement.ondragover = (e) => { e.preventDefault(); };
    this.domElement.ondrop = (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.dropHandler(e); 
    };
    
    this.files.forEach( (file) => {
      let tracks = this.domElement.getElementsByClassName("tracks")[0];
      let track = document.createElement("div");
      track.setAttribute('class', 'track');
      track.innerHTML = `
        <div class="image" style="background-image: url(${file.image});"></div>
        <div class="track-infos">
          <span class="artist">${file.artist}</span> - <span class="track-name">${file.name}</span>
        </div>`;
      tracks.appendChild(track);
      track.addEventListener( "click", () => {
        this.loadFile( file );
      })
    });

    let micElem = document.createElement("div");
    micElem.setAttribute("class", "track microphone");
    micElem.innerHTML = `<div class="icon image" style="background-image: url(./dist/img/microphone.svg);"></div><div class="info-text">Use microphone as input</div>`;
    micElem.addEventListener( "click", () => {
      this.loadMicrophone();
    })
    this.domElement.getElementsByClassName("tracks")[0].appendChild(micElem);

    document.body.appendChild( this.domElement );
  }

  clearLoader()
  {
    this.domElement.className+= " hide";

    return new Promise( (resolve) => {
      setTimeout(()=>{
        this.domElement.remove();
        resolve();
      }, 1100);
    })
  }

  loadFile( file )
  {
    this.clearLoader().then( () => {
      this.callback( 0, `./dist/audio/${file.directory}/${file.filename}` );
    });
  }

  loadMicrophone()
  {
    this.clearLoader().then( () => {
      this.callback(2);
    });
  }

  loadBuffer( file )
  {
    this.clearLoader().then( () => {
      this.callback(1, file);
    });
  }

  dropHandler( event )
  {
    let fLoaded = false, file = null;

    if( event.dataTransfer.items )
    {
      let item = event.dataTransfer.items[0];
      if( item.kind === 'file' )
      {
        file = item.getAsFile();
        fLoaded = true;
      }
    }
    else 
    {
      file = event.dataTransfer.files[0];
      fLoaded = true;
    }

    if( fLoaded && file.type.indexOf("audio") != -1 )
    {
      this.loadBuffer(file);
    }
  }

  loadLibraryFile()
  {
    return new Promise( (resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'text';
      xhr.open( "GET", "./dist/audio/sound-library.json", true );
      xhr.onloadend = () => {
        resolve( JSON.parse(xhr.response) );
      }
      xhr.send();
    })
  }

  loadCovers()
  {
    let loaded = 0;
    return new Promise( (resolve, reject) => {
      this.files.forEach( (file) => {
        let image = new Image();
        image.onload = () => {
          loaded++;
          file.image = `./dist/audio/${file.directory}/${file.cover}`;
          if( loaded == this.files.length )
            resolve();
        }
        image.src = `./dist/audio/${file.directory}/${file.cover}`;
      });
    });
  }

  static get LOAD_TYPE()
  {
    return {
      LIBRARY_FILE: 0, INPUT_FILE: 1, INPUT_MICROPHONE: 2
    }
  }

};


class SoundFile
{
  constructor( options )
  {
    this.name = "";
    this.directory = "";
    this.filename = "";
    this.cover = "cover.jpg";
    this.image = null;

    Object.assign( this, options );
  }
};