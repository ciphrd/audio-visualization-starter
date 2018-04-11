# Audio visualization starter kit

This project was created to provide a powerful and flexible solution to creative audio visualization experiments. You may want to use it if you're only focused on creating visuals and you don't want to invest time in beat detection algorithms. It bundles a few modules that allows you to only focus on interpreting analysed audio data. Here are examples that I made using this project as a core:

* [A simple 2D canvas visualizer](http://crespy-baptiste.com/repo/simple-visualizer/)
* [2D particles reacting to a beat](http://crespy-baptiste.com/repo/2d-particles-booming/)
* [3D fractals "dive-in", based on Barry Martin's Hopalong Orbits Visualizer](http://crespy-baptiste.com/repo/fractals-dive-in/)
* [3D creepy head](http://crespy-baptiste.com/repo/creepy-head)
* [Dark metaballs](http://crespy-baptiste.com/repo/dark-metaballs/)


## What does it do ?

This is what you will get if you run this project as it is right now: 
[Audio visualisation starter](http://crespy-baptiste.com/repo/audio-visualization-starter/)

![Preview](http://crespy-baptiste.com/repo/audio-visualization-starter/git-doc/preview.jpg)

What you can see here is the Visual Helper, it gives you feedback visual informations on what the algorithm is doing in the background. You will only use this as a visual guidance if you want to understand how the peak detection works.

The algorithm uses the Web Audio API and provides an abstraction to audio related stuff. You won't need to **know** how the audio is loaded and how it's processed, you will only need to learn how to process the already-analysed informations. Let's take a look on the data computed by the algorithms.

## Audio Analysed Data 

Let's take a quick tour of all the data you can get with the analysis algorithms:

* **Timedomain Data**: the raw unprocessed signal informations, directly from the Web audio API
* **Frequency Data**: the value of each frequency, using a fourrier-transform, direcly from the Web audio API
* **Energy**: the current energy of the streamed audio. The higher it is, the more powerful the sound is. Computed as the average amplitude of the current signal.
* **Energy History**: a list of the energies. This list is limited over time by the EnergyPersistency parameter. We'll learn more about it later.
* **Energy Average**: the average of the energy history 
* **Peak**: This is the most interesting part. When the energy is greater by a certain scale than the energy average, a peak is detected. To the human ear, it's a beat. The lower the threshold is, the lower the difference between the energy of the moment and the average energy has to be. When you use this data, its value goes from 1 (when a peak is detected) to 0 (when the peak is over). We'll see later how to parameter this, but understand the basics: it goes from 1 to 0 over time, and by using this value you can add effect that will impact significantly the visuals.
* **Peak History**: The history of all the recorded peaks
* **Multiband - Energy, Energy history, Energy Average, Peak, Peak history**: The algorithm can also work on separated frequency bands. Thus, you can detect peak on specific bandwidth, and record when the kick kicks, when a snare claps or variations to the bassline for instance. Use the example and the visual helper to understand if you don't.

This data will give you enough informations to make visuals that react accordingly to what humans feel. For instance, if the speed of an animation of your visualisation relies on the energy average, you will *feel* that the sound makes your animation run faster. Add brutal effects to the peak value, and this effect will only trigger when a beat is detected. These are all effects you can see on the examples I provided at the beginning.

## Ok great, but how does it work ? HOW DO I USE IT ?

Wow, give me a second. I really think that you have to understand how all these data are influenced by the audio. So, again, take your time and play with the [Visual Helper](http://crespy-baptiste.com/repo/audio-visualization-starter/) to visualize it.

### The core of this project

Even though it doesn't seem hard, there are a few concepts you'll have to understand to use **effectively** this project. We'll go through the global running of the app in this section.

First, we have the user selection. Because coding all of this from scratch is boring (trust me), and you usually end up loading a raw mp3 file from the server for a demo, a basic interface is bundled in the project. It allows the user to select an input from different sources:
* an audio file dropped in the window
* an audio file from the library, library that you will set up from him
* his microphone
* a soundcloud link, which can be a track, a playlist
* more will come... but this is already pretty good

From your developer perspective, once the selection is made and a Promise resolved, you'll have a direct access to the analysed data. You just have to create the components and link them together at the beginning, but we'll get into the code later on. 

This are the different audio components:
* **AudioSource** The source from where the audio comes from (yeah the name was pretty self-explanatory)
* **AudioStream** "Transforms" the audio source into a stream. This is obviously not a transformation, but you get the idea. If the user selects a file, it will read data as the file is played. If he selects his microphone, it will read data over time. This module "abstracts" the audio source: whatever the source is, it turns it into a readable stream.
* **AudioAnalyser** Using the audio data from the audio stream, the algorithms return the data we saw before. So whenever you ask this module to get the analysed data, it will be from the *current* audio stream.

If you read this and didn't jump directly to the code, you have now understood how the different modules work together to produce the audio analysed data. 

## All you can use within this project

Now that I ran through the core, I will give an overview of all the modules that I made to make your life easier working with music.

### Loader

The loader provides a visual loading screen in a (subjective) beautiful way. Once everything is loaded, you tell the loader it's done and it fades out. 

### The user selection

Because it's more interesting in an experiment to leave to the user more options, especially when it comes to the audio source, I made a user-selection module. This module allows you in one line to create a first step on the application that will wait for the user to make a selection from
* An audio file from a library you created for him
* An audio file from its computer
* His microphone as input 
* A soundcloud url
* I will add some more, but for now this is already good I think. Let me know if you want more

Regardless on what the user selected as input, you will load the audio the same way.

### HUD

An HUD that comes with an abstraction of [dat.gui](https://github.com/dataarts/dat.gui) and [stats-js](https://github.com/Kevnz/stats.js). From your perspective, you just tell the HUD to load dat.gui, stats-js, and you will be able to configure those using **config files**.

### Visual Helper

We saw this before, but I'll add it to the list. You can quickly see the data given by the analyser using this, helpful when you're not sure that it's working correcly when you visualizer does not behave the expected way, because you're a not-so-sure-of-what-i-m-doing developer (I'm one of them, don't take it personnaly).

### User controls

This can be considered as part of the HUD, but it's a point we'll have to see in detail because this is what you will use to try stuff with different variables. This is all in a config file, still redundant, but less that it is with dat.gui

# How to set up the project

## Installation 

Either download the zip of the file or clone the repository

```bash
git clone https://github.com/bcrespy/audio-visualization-starter.git
```
Install the dependencies 

```bash
npm install 
```

## Developpement

Run the developpement environnement
```
npm run dev
```
You can access the server by going on: [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/) Now every change made to the code while the process started by this command is running will result in a automatic refresh on the browser side.

## Production build

To build your project for an online deployment, you will have to comment this line, because for some reason I couldn't figure out how to make the NODE_ENV variable working:

```js
// this following line has to be commented to run the prod build
devtool: "cheap-module-eval-source-map",
```

Then you can run 

```bash 
npm run prod
```

The js will be bundled in *./dist/app.js*, to upload the project online you only have to upload the *./index.html* and *./dist* folder.

# How does the core of the project works

Besides the **config** files (we'll go through them in the next section), the *./src/main.js* is the only file you should edit. If you open it, you'll see a lot of informations in the comments to help you understand how it works. This section will not repeat what's in that file because it is self-explanatory, and also I'm lazy. However, I made a graphic which explains how the components are created, initialized and the data cycle between them.

![Graphic informations](http://crespy-baptiste.com/repo/audio-visualization-starter/git-doc/graphic.jpg)

# How to configure the components

All the components are using config files to know which data has to be computed and how to compute them.

First, we have the global configuration located in *./src/config/app.config.js*

```js
/**
 * Global settings used by the components
 */
export default {

  // If set to true, the components will log the errors to the console
  showerrors: true,

  // If set to true, the components will log informations about their running
  showloginfos: true,

  // If set to true, the analyser will check if the config is properly set
  checkConfig: true,

  // The key which has to be pressed to show / hide HUD - if set to false HUD can't be toggled
  hudToggleKey: 'h',

  // If the HUD is displayed or not by default 
  hudDisplayed: true,

  // Volume of the audio, updated by the volume control callback
  volume: 0.5,

  // This is where the method for the volume control will be programatically set
  volumeControlCallback: null,

  // the client id for the soundcloud api 
  soundcloudClientId: "ifLq1FIbS6X3sUVhY2k706ZjmmpaOaYW"

};
```

This file is easy to understand, let's get to the *./src/config/analyser.config.js* config file of the analyser.

```js
export default 
{
  options: {
    //...
    peakDetection: {

      // If this boolean is set to true, the analyser will run the algorithm
      enabled: true,

      // options used by the peak detection algorithm
      options: {
        //...
      }
    },

    multibandPeakDetection: 
    {
      // ...
    },

    /**
     * If one of these values are set to true, the analyser will return them with the 
     * getAnalysedDataForVisualization() method. This will not impact the algorithms
     * proccessed on the audio. However, some on these values can't be set to true if
     * the algorithms computing them are not enabled
     */
    returns: {
      //...
      // energy of the signal 
      energy: true,
      //...
      // informations on the peak
      peak: true,
      //...
    }
  },
};
```

The whole file is not displayed here, because it would be useless to list all the settings, they are already commented. **However, I want you to understand how this config works.** First, you can see the config for the peakDetection algorithm, then the multibandPeakDetection algorithm, and a **returns** option with a list of booleans. Because in some situations you don't need all the multiband informations, or even the peak history...etc, this is where you can disable them. If you're not looking for crictical optimisations, leave the file as it is. But if you want to save CPU usage, you want to think about which information you need and which you don't. 

*What happens if I ask for multibandPeak but I have disabled the algorithm with the boolean just above ?* This is why a checkConfig flag exists in the global settings. Il will look at this config file and check if it's valid. If it's not, it prints an error to the console. Then you'll see.

**More settings might be added in the future**, so if those file do not look the same as they are here, it only means I didn't update this part. But the logic will remain the same, and settings will be commented as they actually are.

# Tools that comes with the project

## User selection 

As it is now, there are not so much ways to configure the user selection, and I'm sorry. The only think you can do, is set up your own sound library so that the user can select between tracks you provided. You can also change the icons. Yes, that's it.

The library is located in the *./dist/audio* folder. In this folder you'll find a *sound-library.json* file which lists the tracks you want to add to the library.

```json 
[
  {
    "artist": "Owl Vision",
    "name": "Warhogz",
    "directory": "owl-vision_warhogz",
    "filename": "owl-vision_warhogz.mp3",
    "cover": "cover.jpg"
  },

  {
    "artist": "GosT",
    "name": "Arise",
    "directory": "gost-arise",
    "filename": "gost-arise.mp3",
    "cover": "cover.jpg"
  }
]
```
The user selection module will look to that file to display the tracks in a okay-beautiful way.

## User controls 

The user controls module uses dat.gui to display a gui with the controls specified in the *./src/user/user-controls.js*. Because I found it was too redundant to do a "gui.add()" at each control you wanted to add, I decided to use a "config" file with all the controls. This array is parsed at the beginning and then everything is sent to dat.gui. To add a new control, add an object to the array:

```js
{
  // the object in which the property you want to control is
  object: AppConfig,
  // the key of the property
  property: "volume",
  // mininum, maximum value the property can take and the step between each intermediate value
  min: 0, max: 1, step: 0.05,
  // callback method when the user has changed the value of the property
  callback: (volume) => { AppConfig.volumeControlCallback(volume); }
}
```
To add a folder, just add an array (if you don't understand, look at the file you'll get it):

```js
[
  "Peak detection", // the name of the folder

  {
    // a control of this folder
  },

  {
    // an other control
  }
]
```

You can also add a color control:
```js
{
  object: MyVisualizerConfigObject,
  property: "backgroundColor",
  type: "color"  // you have to set this key to the value "color", then it's identified as a color
},
```

And also boolean / string, the same way, it only depends on the type of they variable accessed with the Object[property]:
```js
{
  // if MyVisualizerConfigObject.backgroundColor is a boolean it will add a boolean control
  object: MyVisualizerConfigObject,
  property: "backgroundColor"
},
```

**I advise you to create a new config file for your visualizer, and import it where you need it. Import it in *user-controls.js* to set controls on its values.**

## Loader
Appendage for the loader *./loader/loader.js*. You can create a loading screen that will hide when you tell him.

```js
// a loader is added to the dom 
let laoder = new Loader();

// fades out the loader, removes the loader from the dom once after it has faded out
loader.loaded();
```

## Visual Helper 

The visual helper exists for 3 reasons:
* give you a visual guidance to what the algorithms are doing
* behaves the same way as a visualizer would do: you initialize it, update it at each frame with the data. Therefore it's a good way for you, if you look in the *./src/mains.js*, to understand how to use your visualizer instead of him (yeah he kinda became a friend to me over the past weeks..)
* I wanted to create an "old-looking" weird interface, that only its creator seems to understand. Now checked on my todo-list :) 

# Conclusion, or something like that

When I was looking for a module, a library, something to make better visualisations, using es6, with already a lot of options bundled in, I couldn't find one. It was some bricks of code there and there, some used old javacript, some were way too big for small projects like this. Problem was: I really wanted to get into advanced visualizations on the web, using modern technics not available before (seriously javascript became so so so fu..... good since the introduction of es6, thank... god?, not thanks to some amazing people). 

I then decided to go through the whole process myself. Understand the Math behind peak detection (not so hard), and code something clean, maintainable that would evovle with my projects over time. At first I didn't plan to release it, I just wanted to have something clean to work on, with all the redundant tasks already made, so that I could only focus on the creative aspects of music visualization.

I thought about a good way to introduce this project in a few lines, but I think there is none. Either I was leaving you with a few informations on how to use this, either I was going for a full-Terminator doc with as much infos as possible for you tu use this. The doc is not yet complete, but I did my best to give you a place where you can find informations on how to use this project. I'm not even sure somebody went through all this shit or will ever see this project. But ffs, if I have at least helped 1 person, I will be happy.

I am opened to discuss about Music Visualization, this starter kit project, or whatever you want, feel free to contact me (but no nudes, please). You can do through my website, and take a look at my work in the meantime if you want to: [http://crespy-baptiste.com](http://crespy-baptiste.com).

# Credits 

I don't care about credits, use this the way you want.

Some papers I used for the peak detection algorithms (not exactly the same but it was a good beginning)
 * [http://archive.gamedev.net/archive/reference/programming/features/beatdetection/](http://archive.gamedev.net/archive/reference/programming/features/beatdetection/)
 * [http://joesul.li/van/beat-detection-using-web-audio/](http://joesul.li/van/beat-detection-using-web-audio/)