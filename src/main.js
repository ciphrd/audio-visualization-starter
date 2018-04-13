/**
 * How does it works 
 * -----------------
 * I encourage you to read [https://github.com/bcrespy/audio-visualization-starter/blob/master/README.md]
 * so that you have a better understanding of how this works
 * Yet, if you really don't want to understand how the project works, you can jump to the
 * CONCLUSION to see what you need to change to use your own visualizer
 * -----------------
 * 
 * 0- You set everything correctly in the config files, located in ./config
 *    This is important to optimize the computations made by the alogorithms and match
 *    your needs at best
 *    Refer to the doc for more infos 
 *    [https://github.com/bcrespy/audio-visualization-starter/blob/master/README.md]
 * 
 * 1- Create a new User Selection
 *    The callback parameter will be called when the selection is done
 * 
 * 2- Instanciate a new Loader, this is only a graphical effect
 * 
 * 3- Create the audio components required for the audio analysis
 *    - AudioSource: an abstraction for everythign related to the loading of the stream
 *    - AudioStream: "turns" the audio source into a generic audio stream 
 *    - AudioAnalyser: computes all the data that you will need for visualization
 * 
 * 4- Instanciate the visualizer. In this case we instanciate the visual helper bundled
 *    with this project, but this is where you would instanciate your own visualizer class
 * 
 * 5- Declare the timers
 *    We need to store the previous frame timer to compute the value of delta time
 *    The start timer is optionnal but I like to keep track of when the app has started
 * 
 * 6- We instanciate the HUD and its components
 *    You can as much HUDElement to the HUD as you want, for now I only coded 2 of them: 
 *    stats and dat.gui
 *    Refer to the doc to have an in-depth description
 *    [https://github.com/bcrespy/audio-visualization-starter/blob/master/README.md]
 * 
 * 7- We load the audio source 
 *    Regardless of the selection type, you'll end up with an audio stream
 *    Once it resolves, we init the visualization
 * 
 * 8- Initialize the audio stream, start the audio and initialize the timers
 * 
 * 9- Initialize the Visualizer. In this case, we initialize the visual helper, but you
 *    will of course initialize your own visualizer. I recommend that you use the same
 *    conception: the visualizer init() method returns a promise that resolves when all
 *    the components required by the visualizer are loaded. This way when the visualization
 *    starts, your Visualizer is operational 
 *    Once it's loaded, we hide the loader and start the main loop, in this case analysis()
 * 
 * 10- The data cycle of the main loop is pretty simple
 *      a) ask for a new call at next frame
 *      b) update the timers, start the stats monitoring
 *      c) ask the analyser the analyse data from the stream. You'll probably never have to touch this part
 *      d) now that we have the analysed data (@type AudioAnalysedDataForVisualization), we can send it
 *         to the visualizer, and in this case ask for a new frame render 
 *      e) update the last frame timer and end the stats monitoring
 * 
 * 
 * CONCLUSION 
 *    If you understood the working of this project, you know that you only have to modify parts 4 / 9 / 10-d 
 *    to use the data with your own visualizer.
 *    All these informations may be overkill, but I also suppose that if you're using this project, you
 *    may not be interested in the underlaying process of sound analysis. Therefore this file gives you a good
 */

import { UserSelection } from './user/user-selection';
import { Loader } from './loader/loader';

import AudioSourceType from './audiostream/audio-source-type';
import { AudioSource } from './audiostream/audio-source';
import { AudioStream } from './audiostream/audio-stream';
import { AudioAnalyser } from './audioanalysis/audio-analyser';

import { AnalysedDataVisualizer } from './audioanalysis/utility/analysed-data-visualizer';

import { HUD } from './hud/hud-controller';
import { Stats } from './tools/stats';
import { GUI } from './tools/gui';
import UserControls from './user/user-controls';

import AppConfig from './config/app.config';
import AnalyserConfig from './config/analyser.config';
import audioSourceType from './audiostream/audio-source-type';


// 1- first we want to stop the application until the user has selected an input
let userSelection = new UserSelection( (selectionType, info) => {

  // 2- we are going to load everything, so we instanciate a new graphical loader
  let loader = new Loader();

  // 3- we create the audio components required for analysis
  let audiosource = new AudioSource();
  let audiostream = new AudioStream( audiosource, AnalyserConfig.options.fftSize, AppConfig.volume );
  let audioAnalyser = new AudioAnalyser( audiostream.getBufferSize() );

  // 4- we instanciate the visualizer -in this case the helper- but this is where you
  //    would instanciate your own
  let visuHelper = new AnalysedDataVisualizer();

  // 5- The timers 
  let startTimer = null,
      lastFrameTimer = null,
      deltaTime = null;
  
  // 6- this is the HUD
  let stats = new Stats( Stats.POSITIONS.BOTTOM_RIGHT );
  let hud = new HUD( stats, new GUI( UserControls ) );

  // 7- We load the audio source,
  audiosource.loadAudioSource( selectionType, info ).then( init );


  // this function is called when the audio source is fully loaded
  function init()
  {
    // 8- Initialize the audio stream, since the audio is loaded and can be played
    audiostream.init();

    // we play the source if it's not a microphone 
    if( selectionType !== AudioSourceType.MICROPHONE )
      audiosource.play();

    // we initialize the timers 
    startTimer = new Date();
    lastFrameTimer = startTimer;

    // 9- This is where you initialize your visualizer, in this case the visual helper 
    //    I recommend that you use the same conception as the visual helper: a function
    //    which returns a promise that resolves when your loader has loaded all its components
    visuHelper.init().then( () => {
      // the loading is done, we can tell the loader to GTFO
      loader.loaded();
      // we call the first analysis(), or update(), or render(), whatever you want to call it
      analysis();
    });
  }

  // 10- the main loop function, called at each frame
  function analysis()
  {
    // a) ask for a call of analysis at next frame
    window.requestAnimationFrame( analysis );

    // b) start the stats monitoring and update the timers
    stats.begin();
    let currentTimer = new Date(),
        deltaTime    = currentTimer - lastFrameTimer;

    // c) send the audio data to the analyser for analysis
    audioAnalyser.analyse( audiostream.getAudioData(), deltaTime, currentTimer )
    let analysedData = audioAnalyser.getAnalysedData(); // we ge the analysed data
    
    // d) we ask the helper to draw the analysed data
    //    this is where we can send the data to a proper visualizer
    visuHelper.draw( analysedData, startTimer );

    // e) end of the stats monitoring
    lastFrameTimer = currentTimer;
    stats.end();
  }

});