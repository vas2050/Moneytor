import React, { Component } from 'react';
import { getUnreadCount } from './AppStorage';
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
    console.log("BadgeCount::getBadgeCount() called");
    const badgeCount = await getUnreadCount('NOTIFs');
    this.setState({badgeCount});
  };

  componentDidMount = () => {
    console.log("BadgeCount::componentDidMount() called");
    this.getBadgeCount();
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
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  }
});
