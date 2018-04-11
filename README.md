# Audio visualization starter kit

This project was created to provide a powerful and flexible solution to creative audio visualization applications. You may want to use it if you're only focused on creating visuals and you don't want to invest time in beat detection algorithms. It bundles a few modules that allows you to only focus on interpreting analysed audio data. Here are examples that I made using this project as a core:

* [A simple 2D canvas visualizer](http://crespy-baptiste.com/repo/simple-visualizer/)
* [2D particles reacting to a beat](http://crespy-baptiste.com/repo/2d-particles-booming/)
* [3D fractals "dive-in", based on Barry Martin's Hopalong Orbits Visualizer](http://crespy-baptiste.com/repo/fractals-dive-in/)
* [3D creepy head](http://crespy-baptiste.com/repo/creepy-head)
* [Dark metaballs](http://crespy-baptiste.com/repo/dark-metaballs/)


## What does it do ?

This is what you will get if you run this project as it is right now: 
[Audio visualisation starter](http://crespy-baptiste.com/repo/audio-visualization-starter/)

![Preview](http://crespy-baptiste.com/repo/audio-visualization-starter/preview.jpg)

What you can see here is the Visual Helper, it shows you visual informations on what the algorithm is doing in the background. You will only use this as a visual guidance if you want to understand how the peak detection works.

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

The loader loads asynchronously all the required data before and after the user selection and then displays it, in a (subjective) beautiful way. 

### HUD

An HUD that comes with an abstraction of dat.gui and stats-js (@me - add links here). From your perspective, you just tell the HUD to load dat.gui, stats-js, and you will be able to configure those using **config files**.

### Visual Helper

We saw this before, but I'll add it to the list. You can quickly see the data given by the analyser using this, helpful when you're not sure that it's working correcly when you visualizer does not behave the expected way, because you're a not-so-sure-of-what-i-m-doing developer (I'm one of them, don't take it personnaly).

### User controls

This can be considered as part of the HUD, but it's a point we'll have to see in detail because this is what you will use to try stuff with different variables. This is all in a config file, still redundant, but less that it is with dat.gui

# Because I am lazy
I haven't finished this doc yet. I'm trying to give as much details as possible because I think that it's important to have a place where you can comeback if you haven't understood how this project works while using it.
If you need more details feel free to contact me. Don't send nudes please.