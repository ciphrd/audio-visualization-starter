import AnalyserConfig from '../config/analyser.config';
import AppConfig from '../config/app.config';


export default [

  /* if it's an object, it is considered as a property
  {

  },*/

  // if it's an array, and first parameter is a string, it is considered as a folder
  [
    "Audio settings",

    {
      object: AppConfig,
      property: "volume",
      min: 0, max: 1, step: 0.05,
      callback: (volume) => { AppConfig.volumeControlCallback(volume); }
    }
  ],

  [
    "Peak detection",

    {
      object: AnalyserConfig.options.peakDetection.options,
      property: "threshold",
      min: 0, max: 6, step: 0.1
    },

    {
      object: AnalyserConfig.options.peakDetection.options,
      property: "ignoreTime",
      min: 0, max: 5000, step: 10
    },

    {
      object: AnalyserConfig.options.peakDetection.options,
      property: "energyPersistence",
      min: 300, max: 6000, step: 10
    },

    {
      object: AnalyserConfig.options.peakDetection.options,
      property: "peakPersistency",
      min: 0, max: 2000, step: 10
    },
  ],

  [
    "Multiband peak detection",

    {
      object: AnalyserConfig.options.multibandPeakDetection.options,
      property: "threshold",
      min: 0, max: 6, step: 0.1
    },

    {
      object: AnalyserConfig.options.multibandPeakDetection.options,
      property: "ignoreTime",
      min: 0, max: 5000, step: 10
    },

    {
      object: AnalyserConfig.options.multibandPeakDetection.options,
      property: "energyPersistence",
      min: 300, max: 6000, step: 10
    },

    {
      object: AnalyserConfig.options.multibandPeakDetection.options,
      property: "peakPersistency",
      min: 0, max: 2000, step: 10
    },
  ],

];