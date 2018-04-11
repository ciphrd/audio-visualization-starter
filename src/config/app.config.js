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