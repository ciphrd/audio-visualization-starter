import AppConfig from '../config/app.config';
import AudioSourceType from '../audiostream/audio-source-type';
import { Loader } from '../loader/loader';

import { UserSelectionComponent } from './components/user-selection.component';
import { ItemComponent } from './components/item.component';
import { TrackComponent } from './components/track.component';



/**
 * Creates a pre-selection screen, handles its dom elements
 * and display an user interface for the audio stream selection
 */
export class UserSelection
{
  /**
   * Callback param 1: type of 
   * @param {*} callback The method to be called once the user has selected an option
   */
  constructor( callback )
  {
    this.loader = new Loader("LOADING LIBRARY");

    this.callback = callback;
    this.files = [];

    this.loadLibraryFile().then( (library) => {
      
      library.forEach( (soundfile) => {
        this.files.push( new SoundFile(soundfile) );
      });
      this.loadCovers().then(()=>{ this.setupSelection(); });

    });

    // the url provider type
    this.urlState = undefined;

    // the state of the user selection 
    this.libraryOpened = false;
  }


  /**
   * Creates the dom elements and associate the events
   * to them
   */
  setupSelection()
  {
    this.loader.loaded();

    this.component = new UserSelectionComponent( (e) => this.dropHandler(e), AppConfig.hudToggleKey );
    
    // Library files element
    this.files.forEach( (file) => {
      let track = new TrackComponent( file.image, file.artist, file.name );
      track.addListener( "click", () => {
        this.loadFile( file );
      });
      this.component.tracksContainer.appendChild( track.dom );
    });

    // Close library button 
    let goback = new ItemComponent( "return.svg", "Go back to the main selection", ["small-icon", "width-150"] );
    goback.addListener( "click", () => {
      this.closeLibrary();
    });
    this.component.tracksContainer.appendChild(goback.dom);

    // Open library element 
    let library = new ItemComponent( "music-folder.svg", "Pick a file from the library", ["small-icon"] );
    library.addListener( "click", () => {
      this.openLibrary();
    });
    this.component.itemsContainer.appendChild(library.dom);

    // Microphone element
    let mic = new ItemComponent( "microphone.svg", "Use microphone as input", ["small-icon", "microphone"] );
    mic.addListener( "click", () => { this.loadMicrophone(); });
    this.component.itemsContainer.appendChild(mic.dom);

    // Soundcloud element 
    let sc = new ItemComponent( "soundcloud.svg", "Soundcloud track/playlist", ["small-icon", "soundcloud"] );
    sc.addListener( "click", () => {
      this.urlState = UserSelection.URL_TYPE.SOUNDCLOUD;
      this.openUrlInterface( "https://soundcloud.com/bookboy-860860771/sets/techno-indus" );
    });
    this.component.itemsContainer.appendChild(sc.dom);

    document.body.appendChild( this.component.dom );

    // the covers listeners
    let covers = document.getElementsByClassName("cover");
    for( let c = 0; c < covers.length; c++ )
    {
      covers[c].addEventListener( "click", () => {
        this.closeUrlInterface();
      });
    }

    // the inputs listeners
    document.getElementById("url-input").addEventListener( "keydown", (event) => {
      if( event.keyCode === 13 )
        this.loadUrl( this.getUrl() );
    });

    this.component.dom.getElementsByClassName("arrow")[0].addEventListener( "click", () => {
      this.loadUrl( this.getUrl() );
    });
  }


  /**
   * Opens the interface that allows the user to pick from
   * a track in thre library 
   */
  openLibrary()
  {
    if( this.libraryOpened === false )
    {
      this.libraryOpened = true;

      if( typeof this.urlState !== "undefined" )
        this.closeUrlInterface();
      
      this.component.itemsContainer.classList.add('hide');
      this.component.tracksContainer.classList.remove('hide');
    }
  }


  /**
   * Closes the library interface
   */
  closeLibrary()
  {
    if( this.libraryOpened )
    {
      this.libraryOpened = false;

      this.component.itemsContainer.classList.remove('hide');
      this.component.tracksContainer.classList.add('hide');
    }
  }


  /**
   * Open the interface where the user can enter a soundcloud url
   * @param {string=} placeholder the text in the input 
   */
  openUrlInterface( placeholder = "" )
  {
    // first the cover elements
    let covers = document.getElementsByClassName("cover");
    for( let c = 0; c < covers.length; c++ )
    {
      let item = covers.item(c);
      item.classList.remove("closed");
      item.classList.add("opened");
    }

    let elem = document.getElementById("url-provider");
    elem.className = "opened";

    // events for sending the url 
    let input = document.getElementById("url-input");
    input.value = placeholder;
    input.focus();
  }


  /**
   * @returns {string} the url from the input 
   */
  getUrl()
  {
    return document.getElementById("url-input").value;
  }

  
  /**
   * Given the url state, loads the corresponding module 
   * @param {string} url the url to load
   */
  loadUrl( url )
  {
    if( typeof this.urlState !== "undefined" )
    {
      switch( this.urlState )
      {
        case UserSelection.URL_TYPE.SOUNDCLOUD:
          this.loadSoundcloud( url );
          break;
      }
    }

    this.closeUrlInterface();
  }


  /**
   * Closes the interface
   */
  closeUrlInterface()
  {
    this.urlState = undefined;

    // first the cover elements
    let covers = document.getElementsByClassName("cover");
    for( let c = 0; c < covers.length; c++ )
    {
      let item = covers.item(c);
      item.classList.remove("opened");
      item.classList.add("closed");
    }

    let elem = document.getElementById("url-provider");
    elem.className = "closed";
  }


  /** 
   * Hides the user selection and removes then elements from the DOM
   * @returns {Promise} resolves when the elements are hidden
   */
  clearSelection()
  {
    this.component.dom.className+= " hide";

    return new Promise( (resolve) => {
      setTimeout(()=>{
        this.component.dom.remove();
        resolve();
      }, 800);
    })
  }


  /**
   * Called when user selected a file from the library
   * Calls the callback method with the audio file to read
   */
  loadFile( file )
  {
    this.clearSelection().then( () => {
      this.callback( AudioSourceType.FILE_LIBRARY, `./dist/audio/${file.directory}/${file.filename}` );
    });
  }


  /**
   * Called when user selected microphone
   * Calls the callback method
   */
  loadMicrophone()
  {
    this.clearSelection().then( () => {
      this.callback( AudioSourceType.MICROPHONE );
    });
  }


  /**
   * Called when user dropped an audio file 
   * Calls the callback method sending the file data to be read
   * @param {File} file The file buffer to be read
   */
  loadBuffer( file )
  {
    this.clearSelection().then( () => {
      this.callback( AudioSourceType.FILE_USER, file );
    });
  }


  /**
   * Called when user provides an url to fetch
   * maybe check here if the url is valid?
   * @param {string} url the url to check
   */
  loadSoundcloud( url )
  {
    this.clearSelection().then( () => {
      this.callback( AudioSourceType.SOUNDCLOUD, url );
    });
  }


  /**
   * Handles the drop event trigger
   * @param {DragEvent} event 
   */
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
    else if( AppConfig.showerrors )
    {
      console.error( `The file is not an audio type.` );
    }
  }


  /**
   * Loads the library file 
   */
  loadLibraryFile()
  {
    return new Promise( (resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'text';
      xhr.open( "GET", "./dist/audio/sound-library.json", true );
      xhr.onloadend = () => {
        if( AppConfig.showloginfos ) console.log( `Library file loaded\n------------` );
        resolve( JSON.parse(xhr.response) );
      }
      xhr.onerror = () => {
        if( AppConfig.showerrors ) console.error( `Couldn't load the library file ./dist/audio/sound-library.json` );
        reject();
      }
      xhr.send();
    })
  }


  /**
   * Loads the images from the library
   * @returns {Promise} a promise which resolves once all the images are loaded
   */
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
        image.onerror = () => { 
          loaded++;
          file.image = '';
          if( AppConfig.showerrors ) console.error( `Couldn't load the cover /${file.directory}/${file.cover}` );
          if( loaded == this.files.length )
            resolve();
        };
        image.src = `./dist/audio/${file.directory}/${file.cover}`;
      });
    });
  }

  /**
   * The different states of the url provider
   */
  static get URL_TYPE()
  {
    return {
      SOUNDCLOUD: 0
    }
  }

  /**
   * The different possible states of the user selection 
   */
  static get STATES()
  {
    return {
      INDEX: 0, // no action, selection index
      INPUT_URL: 1, // user enters an url 
      LIBRARY_FOLDER: 2, // user is looking the library files 
    }
  }

};


/**
 * Very simple SoundFile structure, used to handle the
 * files from the library
 */
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