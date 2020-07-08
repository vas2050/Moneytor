/**
  <<>> Moneytor.Lite <<>>
  <<>> A simple app to keep users updated with the xchange rate
  <<>> and notified of rate when it hits the user-defined threshold value.
**/

import React, { Component, useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import { Dimensions } from 'react-native';
import Icon from 'react-native-ionicons';
import {
  Platform,
  Alert,
  View,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';

import Home from './src/views/HomeView';
import Alerts from './src/views/AlertView';
import Settings from './src/views/SettingsView';
import ContactUs from './src/views/ContactView';
import BadgeCount from './src/views/BadgeView';
import * as Notifications from './src/lib/NotificationHandler';
import { navigationRef, isMountedRef } from './src/lib/NavigationHandler';

const ContactScreen = () => {
  console.log("INFO: App::ContactScreen() called");
  return (
    <ScrollView contentContainerStyle={style.scrollView}>
      <ContactUs />
    </ScrollView>
  );
};

const SettingsScreen = () => {
  console.log("INFO: App::SettingsScreen() called");
  return (
    <ScrollView contentContainerStyle={style.scrollView}>
      <Settings />
    </ScrollView>
  );
};

const AlertScreen = () => {
  console.log("INFO: App::AlertScreen() called");
  return (
    <ScrollView contentContainerStyle={style.scrollView}>
      <Alerts />
    </ScrollView>
  );
};

const HomeScreen = (props) => {
  console.log("INFO: App::HomeScreen() called");
  return (
    <ScrollView contentContainerStyle={style.scrollView}>
      <Home />
    </ScrollView>
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
  Alerts: {
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
      tabBarLabel: 'Contact',
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

/*
// not required now
const NO_OF_TABS = Object.keys(RouteConfigs).length;
const TAB_WIDTH = (Dimensions.get('window').width)/NO_OF_TABS;
*/

const BottomTabNavigatorConfig = {
  initialRouteName: 'Home',
  order: [ 'Home', 'Settings', 'Alerts', 'Contact' ],
  pressColor: "yellow",
  tabBarOptions: {
    pressOpacity: 0.3,
    upperCaseLabel: false,
    //scrollEnabled: true,
    showIcon: true,
    showLabel: true,
    activeTintColor: 'blue',
    inactiveTintColor: 'gray',
    swipeEnabled: true,
    //activeBackgroundColor: 'black',
    //inactiveBackgroundColor: 'gray',
    tabStyle: {
      //width: TAB_WIDTH,
      height: 50
    },
    style: {
      borderTopWidth: 1,
      borderColor: "red",
      backgroundColor: 'lightyellow'
    },
    labelStyle: {
      //fontVariant: ['small-caps'],
      fontSize: 11,
      color: "gray",
    },
    indicatorStyle: {
      //borderTopColor: "red",
      //borderTopWidth: 4,
      backgroundColor: 'blue'
    }
  },
  tabBarPosition: 'bottom',
};

const TabNavigator = createMaterialTopTabNavigator(RouteConfigs, BottomTabNavigatorConfig);
const AppContainer = createAppContainer(TabNavigator);

export default function App() {
  const [hello, setHello] = useState(0);

  useEffect(() => {
    console.log("INFO: App::componentDidMount() called");
    if (Platform.OS === "android") {
      Notifications.createNotificationChannel();
    }

    // to track when the App is mounted
    isMountedRef.current = true;

    Notifications.checkPermission();
    Notifications.createNotificationListeners();

    // clean up
    return () => {
      console.log("INFO: App::componentWillUnmount() called");
      isMountedRef.current = false;
      Notifications.notificationListener = null;
      Notifications.notificationOpenedListener = null;
    }
  }, []);

  return (
    <AppContainer ref={navigationRef} />
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
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
    flex: 9,
    alignSelf: "center"
  },
  footer: {
    backgroundColor: 'yellow',
    flex: .5,
  },
  footerText: {
    margin: 3,
    textAlign: 'center'
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    borderColor: 'red',
    borderRightWidth: .5,
    borderLeftWidth: .5,
    borderBottomWidth: 0,
    borderTopWidth: 30,
    borderTopColor: "lightyellow",
    backgroundColor: "white",
    alignItems: "center"
  }
});
