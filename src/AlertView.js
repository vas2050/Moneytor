import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import { readStoreItems, createStoreItems } from './AppStorage';

export default class AlertView extends Component {
  state = {
    notif: [],
    note: "No Notifications Yet!"
  };

  getNotifications = async () => {
    console.log("INFO: Notif::getNotifications() called");
    const notif = await readStoreItems('NOTIFs');
    if (notif && notif.length) {
      const note = "Last 10 Notifications";
      this.setState({notif: notif.reverse(), note});
    }
  };

  componentDidMount = () => {
    console.log("INFO: Notif::componentDidMount() called");
    this.getNotifications();
  };

  handlePress = async (index) => {
    console.log("INFO: Notif::handlePress() called");
    let { notif } = this.state;
    notif[index].read = true;
    this.setState({notif});
    createStoreItems('NOTIFs', notif.reverse());
    Alert.alert(notif[index].title, notif[index].body);
  };

  render() {
    return (
      <View style={style.container}>
        <Text style={style.note}>{this.state.note}</Text>
        {
          this.state.notif.map((item, key) => {
            return (
                <TouchableHighlight
                  //style={{ backgroundColor: (item.read === true ? "blue" : "gray") }}
                  underlayColor="yellow"
                  key={key}
                  style={[style.buttonView, {backgroundColor: (item.read ? "silver" : "white")} ]}
                  onPress={() => this.handlePress(key)}
                  activeOpacity={0.2}
                >
                  <Text style={style.buttonItem}>{item.date + '-' + item.title}</Text>
                </TouchableHighlight>
            )
          })
        }
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonView: {
    alignItems: "center",
    padding: 8,
    margin: 8,
    backgroundColor: null,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "blue",
    borderStyle: "solid",
  },
  buttonItem: {
    backgroundColor: null,
    width: 310,
    margin: 6,
    fontSize: 14,
    color: "blue",
    fontVariant: ['small-caps']
  },
  note: {
    marginTop: 50,
    marginBottom: 10,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
  }
});
