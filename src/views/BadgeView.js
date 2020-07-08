import React, { Component } from 'react';
import events from 'events';
import firebase from 'react-native-firebase';
import { getUnreadCount, createStoreItem } from '../lib/AppStorage';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class BadgeCount extends Component {
  state = {
    badgeCount: 0
  };

  getBadgeCount = async () => {
    console.log("INFO: BadgeCount::getBadgeCount() called");
    const badgeCount = await getUnreadCount('NOTIFs');
    //let badgeCount = await firebase.notifications().getBadge();
    this.setState({badgeCount});
  };

  componentDidMount = () => {
    console.log("INFO: BadgeCount::componentDidMount() called");

    //assign the event handler to an event
    const eventEmitter = new events.EventEmitter();
    createStoreItem("events", eventEmitter);
    console.log("event: ", eventEmitter);
    eventEmitter.on("updateBadge", this.getBadgeCount);
    console.log("emit: ", eventEmitter.emit("updateBadge"));

    //this.getBadgeCount();
  };

  componentWillUnmount = () => {
  };

  render() {
    if (this.state.badgeCount > 0) {
      return (
        <View style={style.badgeView}>
          <Text style={style.badgeText}>{this.state.badgeCount}</Text>
        </View>
      );
    }
    else {
      return (
        <View />
      );
    }
  }
}

const style = StyleSheet.create({
  badgeView: {
    position: 'absolute',
    right: -1,
    top: -1,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold'
  }
});
