import Sound from 'react-native-sound';

Sound.setCategory('Ambient', true);

const buttonPress = new Sound(require('../audio/button_01.mp3'), err => console.log(err));
const switchToggle = new Sound(require('../audio/switch_01.mp3'), err => console.log(err));
const submitPress = new Sound(require('../audio/submit_01.mp3'), err => console.log(err));
const radioPress = new Sound(require('../audio/radio_01.mp3'), err => console.log(err));
const alertUp = new Sound(require('../audio/alert_01.mp3'), err => console.log(err));
const spinnerUp = new Sound(require('../audio/alert_01.mp3'), err => console.log(err));

const playButtonPress = () => {
  //buttonPress.play((success) => buttonPress.reset());
};

const playRadioPress = () => {
  //radioPress.play((success) => radioPress.reset());
};

const playSwitchToggle = () => {
  //switchToggle.play((success) => switchToggle.reset());
};

const playSubmitPress = () => {
  //submitPress.play((success) => submitPress.reset());
};

const playAlert = () => {
  //alertUp.play((success) => alertUp.reset());
};

const playSpinner = () => {
  //spinnerUp.play((success) => spinnerUp.reset());
};

export {
  playButtonPress,
  playRadioPress,
  playSwitchToggle,
  playSubmitPress,
  playAlert,
  playSpinner
};
