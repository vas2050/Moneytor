import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import { readStoreItem, createStoreItem } from '../lib/AppStorage';

export default class AlertView extends Component {
  state = {
    notif: {},
    note: "No Notifications Yet!"
  };

  getNotifications = async () => {
    console.log("INFO: Alerts::getNotifications() called");

    const notif = await readStoreItem('NOTIFs');
    if (notif) {
      const items = Object.keys(notif);
      if (items && items.length) {
        const note = "Last 20 Notifications";
        this.setState({notif, note});
      }
    }
  };

  componentDidMount = () => {
    console.log("INFO: Alerts::componentDidMount() called");
    this.getNotifications();
  };

  handlePress = async (id) => {
    console.log("INFO: Alerts::handlePress() called");
    let { notif } = this.state;
    if (notif[id]) {
      if (notif[id].read !== true) { // set only if state is different
        notif[id].read = true; // mark this item as read
        this.setState({notif});
        createStoreItem('NOTIFs', notif);
        let badgeCount = await firebase.notifications().getBadge();
        firebase.notifications().setBadge(--badgeCount);
      }
      Alert.alert(notif[id].title, notif[id].body, [{text: 'Close', style: 'cancel'}]);
    }
    else {
      Alert.alert("Not Found", "This notification may have already been removed!");
    }
  };

  render() {
    const { notif } = this.state;
    let dateNotif = {};
    Object.keys(notif).sort((a,b) => b-a).map(id => {
      const item = notif[id];
      if (! dateNotif[item.date]) {
        dateNotif[item.date] = [];
      }
      dateNotif[item.date].push(item);
    });

    return (
      <View style={style.container}>
        <Text style={style.note}>{this.state.note}</Text>
        {
          Object.keys(dateNotif).map((date, key1) => {
            return (
              <React.Fragment key={key1}>
                <Text style={{margin: 5, fontWeight: "bold", fontSize: 16, color: "black"}}>{date}</Text>
                {
                  dateNotif[date].map((obj, key2) => {
                    return (
                      <TouchableHighlight
                        underlayColor="yellow"
                        key={key2}
                        //style={[style.buttonView, {backgroundColor: (key % 2 ? "gray" : "silver")}]}
                        style={style.buttonView}
                        onPress={() => this.handlePress(obj.id)}
                        activeOpacity={0.2}
                      >
                        <Text style={[style.buttonItem, {fontWeight: (obj.read ? null : "bold")}]}>
                          {obj.time + ' - ' + obj.title}
                        </Text>
                      </TouchableHighlight>
                    )
                  })
                }
              </React.Fragment>
            )
          })
        }
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonView: {
    alignItems: "flex-start",
    padding: 8,
    margin: 8,
    backgroundColor: null,
    borderRadius: 0,
    borderWidth: 1,
    borderBottomWidth: 10,
    borderTopWidth: 1,
    borderColor: "silver",
    borderStyle: "solid",
  },
  buttonItem: {
    backgroundColor: null,
    width: 340,
    //marginLeft: 10,
    fontSize: 16,
    color: "black",
    fontWeight: null
  },
  note: {
    fontSize: 16,
    marginTop: 50,
    marginBottom: 20,
    color: "blue",
    fontWeight: "bold",
    alignSelf: "center",
  }
});
