/*
<<>> Moneytor <<>>
<<>> A simple app to keep users updated with the xchange rate
<<>> and notified of rate when it hits the user-defined threshold value.
*/

import React, { Component } from 'react';
import {
  Platform,
  Alert,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Switch
} from 'react-native';

import RadioForm from 'react-native-simple-radio-button';
import Notifications from './Notifications'; 

export default class Main extends Component {
  // define the state for various companies and default schedule: daily
  // look up in the schedules with id: 1 for weekly
  state = {
    comps: [
      {id: 0, isOn: false, schedule: 1, name: 'xoom'},
      {id: 1, isOn: false, schedule: 1, name: 'abc'},
      {id: 2, isOn: false, schedule: 1, name: 'xyz'}
    ],

    // for the sake of look up, keeping id value as 'value'
    schedules: [
      {value: 0, label: ' '.repeat(4), id: 'daily'},
      {value: 1, label: ' '.repeat(4), id: 'weekly'},
      {value: 2, label: ' '.repeat(4), id: 'monthly'}
    ]
  };

  componentDidMount = () => {
    console.log("INFO: Home::componentDidMount() called");
    // nothing for now
  };

  // to be built soon - to show last 5 days statistics
  handleButton = async index => {
    console.log("INFO: Home::handleButton() called");
    const item = {...this.state.comps[index]};
    const isOn = item.isOn ? "Switched ON" : "Switched OFF";
    alert(item.name + ": " + isOn);
  };

  // save state of switch
  handleSwitch = async index => {
    console.log("INFO: Home::handleSwitch() called");
    const curComps = [...this.state.comps];
    let cRow = {...curComps[index]};
    const compName = cRow.name.toUpperCase();
    const schedule = this.state.schedules[cRow.schedule].id;

    cRow.isOn = !cRow.isOn;
    curComps[index] = cRow;

    // enable, disable local push notifications when switch turned ON and OFF
    if (cRow.isOn) { // schedule notification
      // check if notification permitted, proceed only if permitted
      // in case user did change settings outside the app
      // so we better not save the state of hasPermission in the main program
      if (await Notifications.checkPermission()) {
        Notifications.scheduleNotification(compName, schedule);
        this.setState({comps: curComps});
      }
      else {
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
      const schedule = this.state.schedules[cRow.schedule].id;
      Notifications.cancelNotification(compName);
      setTimeout(() => Notifications.scheduleNotification(compName, schedule), 5*1000);
    }
  };

  alertMessage = async (company, schedule) => {
    console.log("INFO: Home::alertMessage() called");
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
    //console.log(this.state.comps);
    return (
      <View style={style.container}>
        <View style={style.scheduleView}>
        {
          this.state.schedules.map((rec, key) => {
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
                  trackColor={{false: "#949494", true: "#949494" }}
                  thumbColor={rec.isOn ? "green" : "white"}
                  value={rec.isOn}
                  onValueChange={() => this.handleSwitch(key)}
                  ios_backgroundColor="#949494" // trackColor for iOS to work
                />
                <TouchableOpacity
                  style={style.buttonView}
                  onPress={() => this.handleButton(key)}
                  activeOpacity={.4}
                >
                  <Text style={style.buttonItem}>{rec.name}</Text>
                </TouchableOpacity>
                <RadioForm
                  style={style.radioView}
                  formHorizontal={true}
                  //labelHorizontal={true}
                  radio_props={this.state.schedules}
                  disabled={rec.isOn ? false : true}
                  initial={1}
                  onPress={(value) => this.handleRadio(rec.id, value)}
                  buttonSize={25}
                  buttonOuterSize={40}
                  selectedButtonColor={rec.isOn ? 'green' : 'gray'}
                  buttonColor="gray"
                  animation={true}
                  //buttonStyle={style.radioItem}
                  //buttonWrapStyle={{marginLeft: 20}}
                  //selectedLabelColor={'green'}
                  //labelStyle={{fontSize:0}}
                />
              </View>
            )
          })
        }
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
    borderWidth: 4,
    borderColor: "orange",
    borderStyle: "solid",
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
    marginLeft: 10,
    fontVariant: ['small-caps']
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
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]
  }
});
