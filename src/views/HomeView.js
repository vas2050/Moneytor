/*
<<>> Moneytor <<>>
<<>> A simple app to keep users updated with the xchange rate
<<>> and notified of rate when it hits the user-defined threshold value.
*/

import React, { Component } from 'react';
import {
  playButtonPress,
  playRadioPress,
  playSwitchToggle,
  playAlert,
  playSpinner,
} from '../lib/PlayAudio';

import * as Progress from 'react-native-progress';
import { BlurView } from '@react-native-community/blur';
import {
  Platform,
  Alert,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Switch
} from 'react-native';

import { getFxRateLight } from '../lib/FxRateLight';
import { getCountry } from '../lib/CountryData';
import RadioForm from 'react-native-simple-radio-button';
import * as companyConfig from '../config/CompanyList';
import * as Notifications from '../lib/NotificationHandler'; 
import { readStoreItem, createStoreItem } from '../lib/AppStorage'; 

const schedules = companyConfig.schedules;

export default class Main extends Component {
  // define the state for various companies and default schedule: daily
  // look up in the schedules with id: 1 for weekly

  state = {
    comps: [],
    isLoading: false,
    to: null,
    from: null,
    sendAmount: null,
  };

  componentDidMount = () => {
    console.log("INFO: Home::componentDidMount() called");
    const { to, from, sendAmount, navigation } = this.props; // first time, default values come from App
    this.setState({to, from, sendAmount});
    Notifications.updateDefaults({to, from, sendAmount, navigation}); // initial set up
    this.setComps();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const {from, to, sendAmount} = this.props;
    let changed = false;
    if (from !== undefined && from !== this.state.from) {
      console.log("FROM being set");
      this.setState({from});
      changed = true;
    }
    if (to !== undefined && to !== this.state.to) {
      console.log("TO being set");
      this.setState({to});
      changed = true;
    }
    if (sendAmount !== undefined && sendAmount !== this.state.sendAmount) {
      console.log("SENDAMOUNT being set");
      this.setState({sendAmount});
      changed = true;
    }
    // update notification module too, so running schedules will consume the change 
    // only if needed
    if (changed) { 
      Notifications.updateDefaults({to, from, sendAmount});
    }
  };

  SAFE_componentWillMount = () => {
    console.log("INFO: Home::componentWillMount() called");
  };

  componentWillUnmount = () => {
    console.log("INFO: Home::componentWillUnmount() called");
    createStoreItem('COMPs', this.state.comps);
  };

  setComps = async () => {
    console.log("INFO: Home::setComps() called");
    let comps = await readStoreItem("COMPs");
    if (!comps || !comps.length) {
      comps = companyConfig.comps;
    }
    this.setState({comps});
  };

  // to be built soon - to show last 5 days statistics
  handleButton = async index => {
    console.log("INFO: Home::handleButton() called");

    this.setState({isLoading: true});
    const item = {...this.state.comps[index]};
    //const isOn = item.isOn ? "Switched ON" : "Switched OFF";
    //alert(item.name + ": " + isOn);

    const { to, from, sendAmount } = this.state;
    let countryObj = null;
    try {
      countryObj = await getCountry(to, from);
    }
    catch(err) {
      console.log("ERROR: unable to getCountry()");
      Alert.alert("Error", "Unable to fetch currency details");
      return false;
    }

    const { dCurrencySign, sCountryCode, sCurrencySign } = countryObj;
    getFxRateLight(item.name, {...countryObj, sendAmount})
    .then(rate => {
      playAlert();
      Alert.alert(`${dCurrencySign} ${rate} \u2190` + item.name.toUpperCase(),
                    `***calculated for ${sCountryCode}${sCurrencySign} ${sendAmount}`);
      this.setState({isLoading: false});
    })
    .catch(err => {
      console.log("ERROR: ", err);
      playAlert();
      if (err === 'timeout') {
        Alert.alert("Error", "Sorry, request timed out!");
      }
      else {
        Alert.alert("Error", "Unable to fetch the rate!");
      }
      this.setState({isLoading: false});
    });
  };

  // save state of switch
  handleSwitch = async index => {
    console.log("INFO: Home::handleSwitch() called");

    const curComps = [...this.state.comps];
    let cRow = {...curComps[index]};
    const compName = cRow.name.toUpperCase();
    const schedule = schedules[cRow.schedule].id;

    cRow.isOn = !cRow.isOn;
    curComps[index] = cRow;

    // enable, disable local push notifications when switch turned ON and OFF
    if (cRow.isOn) { // schedule notification
      // check if notification permitted, proceed only if permitted
      // in case user did change settings outside the app
      // so we better not save the state of hasPermission in the main program
      if (await Notifications.checkPermission()) {
        const {to, from, sendAmount} = this.state;
        Notifications.scheduleNotification(compName, schedule);
        this.setState({comps: curComps});
      }
      else {
        playAlert();
        alert("You need to turn on notifications for the app to notify you regularly!");
      }
    }
    else {
      // cancel already scheduled notification
      // even if notification not permitted, no issue
      Notifications.cancelNotification(compName);
      this.setState({comps: curComps});
    }
  };

  delay = async sec => {
    setTimeout(() => console.log("INFO: delay() called"), sec*1000);
  };

  // save state of schedule
  handleRadio = async (compId, scheduleId) => {
    console.log("INFO: Home::handleRadio() called");

    // 2 buttons alert
    //alertMessage(comps[compId].name.toUpperCase(), schedules[scheduleId].id.toUpperCase());
    const curComps = [...this.state.comps];
    let cRow = {...curComps[compId]};
    // change state only if the requested schedule type is different
    // from the current schedule type, otherwise do nothing :)
    if (cRow.schedule !== scheduleId) {
      cRow.schedule = scheduleId;
      curComps[compId] = cRow;
      this.setState({comps: curComps});
      // cancel the currently running and run per the new schedule
      const compName = cRow.name.toUpperCase();
      const schedule = schedules[cRow.schedule].id;
      Notifications.cancelNotification(compName);
      setTimeout(() => Notifications.scheduleNotification(compName, schedule), 5*1000);
    }
  };

  alertMessage = async (company, schedule) => {
    console.log("INFO: Home::alertMessage() called");
    playAlert();
    Alert.alert(
      "Alert",
      "You will receive updates on " + schedule + " basis for " + company,
      [
        {
          text: "Cancel",
          onPress: () => console.log("INFO: Cancel pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => console.log("INFO: OK pressed"),
          style: "ok" // no such style :)
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <View style={style.container}>
        <View style={style.scheduleView}>
        {
          schedules.map((rec, key) => {
            return (
              <Text key={key} style={style.scheduleItem}>{rec.id}</Text>
            )
          })
        }
        </View>
        {
          this.state.comps.map((rec, key) => {
            return (
              <View key={key} style={{flexDirection: "row", margin: 8}}>
                <Switch
                  width="50"
                  style={style.switchItem}
                  trackColor={{false: "gray", true: "green"}}
                  thumbColor="white"
                  value={rec.isOn}
                  onValueChange={() => {playSwitchToggle(); this.handleSwitch(key)}}
                  ios_backgroundColor="gray" // trackColor for iOS to work
                  useNativeDriver={true}
                />
                <TouchableOpacity
                  style={style.buttonView}
                  onPress={() => {playButtonPress(); this.handleButton(key)}}
                  activeOpacity={.2}
                  useNativeDriver={true}
                >
                  <Text style={style.buttonItem}>{rec.name}</Text>
                </TouchableOpacity>
                <RadioForm
                  style={style.radioView}
                  formHorizontal={true}
                  //labelHorizontal={true}
                  radio_props={schedules}
                  disabled={rec.isOn ? false : true}
                  initial={rec.schedule}
                  onPress={value => {playRadioPress(); this.handleRadio(rec.id, value)}}
                  buttonSize={25}
                  buttonOuterSize={40}
                  selectedButtonColor={rec.isOn ? 'green' : 'gray'}
                  buttonColor="gray"
                  animation={true}
                  useNativeDriver={true}
                  //buttonStyle={style.radioItem}
                  //buttonWrapStyle={{marginLeft: 20}}
                  //selectedLabelColor={'green'}
                  //labelStyle={{fontSize:0}}
                />
              </View>
            )
          })
        }
        { 
          this.state.isLoading &&
            <BlurView
              style={{left:0, right:0, top: 0, bottom: 0, position: "absolute"}}
              reducedTransparencyFallbackColor="white"
              blurType="light"
              blurAmount={5}
            />

        }
        {
          this.state.isLoading &&
            <Progress.Circle // request in progress, spinner
              progress={.5}
              color="blue"
              unfilledColor="white"
              fill="green"
              borderColor="red"
              thickness={10}
              borderWidth={4}
              indeterminate={true}
              style={style.spinner}
              size={90}
              endAngle={.9}
              strokeCap="butt"
            />
        }
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    margin: 0
  },
  title: {
    fontWeight: "bold",
    color: "blue",
    marginVertical: 2,
    fontSize: 20
  },
  line: {
    borderBottomColor: "green",
    borderBottomWidth: 2,
    margin: 40,
   width: "90%"
  },
  buttonView: {
    padding: 5,
    margin: 5,
    borderColor: "blue",
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 5,
    borderColor: "orange",
    borderStyle: "solid",
    marginLeft: 10,
  },
  buttonItem: {
    width: 50,
    fontSize: 18,
    fontWeight: "bold",
    color: "maroon",
    textAlign: "center",
    fontVariant: ['small-caps']
  },
  scheduleView: {
    flexDirection: "row",
    marginLeft: 165,
    marginTop: 8,
  },
  scheduleItem: {
    fontSize: 16,
    color: "black",
    textAlign: "left",
    marginBottom: 3,
    marginLeft: 14,
    //fontVariant: ['small-caps']
    fontWeight: "bold",
    textTransform: "capitalize"
  },
  radioView: {
    marginLeft: 20,
    marginTop: 8
  },
  radioItem: {
    marginLeft: 8
  },
  switchItem: {
    margin: 10,
    alignSelf: "center",
    transform: [{scaleX: 1.3}, {scaleY: 1.3}]
  },
  spinner: {
    alignSelf: "center",
    position: "absolute",
    //transform: [{scaleX: 2.0}, {scaleY: 2.0}]
  }
});
