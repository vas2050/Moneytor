/**
  <<>> Moneytor.Lite <<>>
  <<>> A simple app to keep users updated with the xchange rate
  <<>> and notified of rate when it hits the user-defined threshold value.
**/

import React, { Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Icon from 'react-native-ionicons';
import {
  Platform,
  Alert,
  View,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';

import Home from './src/HomeView';
import Notifs from './src/AlertView';
import Settings from './src/Settings';
import ContactUs from './src/ContactUs';
import BadgeCount from './src/BadgeCount';
import Notifications from './src/Notifications';

const ContactScreen = () => {
  console.log("App::ContactScreen() called");
  return (
    <View style={style.view}>
      <ContactUs />
    </View>
  );
};

const SettingsScreen = () => {
  console.log("App::SettingsScreen() called");
  return (
    <View style={style.view}>
      <Settings />
    </View>
  );
};

const AlertScreen = () => {
  console.log("App::AlertScreen() called");
  return (
    <ScrollView>
      <View style={style.view}>
        <Notifs />
      </View>
    </ScrollView>
  );
};

const HomeScreen = () => {
  console.log("App::HomeScreen() called");
  return (
      <View style={style.view}>
        <ScrollView>
          <Home />
        </ScrollView>
      </View>
  );
};

const RouteConfigs = {
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-home" color={tintColor} size={25} />
      )
    }
  },
  Notif: {
    screen: AlertScreen,
    navigationOptions: {
      tabBarLabel: 'Alerts',
      tabBarIcon: ({ tintColor }) => (
        <View>
          <Icon name="ios-notifications" color={tintColor} size={25} />
          <BadgeCount />
        </View>
      )
    }
  },
  Contact: {
    screen: ContactScreen,
    navigationOptions: {
      tabBarLabel: 'Contact Us',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-mail" color={tintColor} size={25} />
      )
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-settings" color={tintColor} size={25} />
      )
    }
  }
};

const BottomTabNavigatorConfig = {
  animationEnabled: true,
  initialRouteName: 'Home',
  order: [ 'Home', 'Notif', 'Settings', 'Contact' ],
  tabBarOptions: {
    activeTintColor: 'blue',
    inactiveTintColor: 'gray',
    //activeBackgroundColor: 'black',
    //inactiveBackgroundColor: 'gray',
    style: {
      backgroundColor: 'lightyellow'
    },
    labelStyle: {
      fontVariant: ['small-caps'],
      fontSize: 12
    },
    //tabStyle: {},
  },
};

const TabNavigator = createBottomTabNavigator(RouteConfigs, BottomTabNavigatorConfig);
const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component {
  componentDidMount = () => {
    console.log("App::componentDidMount() called");
    // for Android devices, notification channel must be created
    // and specified while posting a notification
    if (Platform.OS === "android") {
      Notifications.createNotificationChannel();
    }

    // if permitted, add a notification listener
    Notifications.checkPermission();
    Notifications.createNotificationListeners();
  };

  componentWillUnmount = () => {
    console.log("App::componentWillUnmount() called");
    Notifications.notificationListener = null;
    Notifications.notificationOpenedListener = null;
  };

  render() {
    return (
      <AppContainer />
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  box: {
    height: '100%',
    flex: 10
  },
  header: {
    backgroundColor: 'black',
    flex: 1
  },
  view: {
    justifyContent: 'center',
    backgroundColor: 'white',
    flex: 9
  },
  footer: {
    backgroundColor: 'yellow',
    flex: .5,
  },
  footerText: {
    margin: 3,
    textAlign: 'center'
  },
});
