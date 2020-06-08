import React, { Component } from 'react';
import { Dropdown } from 'react-native-material-dropdown'; 
import {
  Alert,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

import { currencies } from '../config/CurrencyList';
import { createStoreItem } from '../lib/AppStorage';

export default class Settings extends Component {
  state = {
    to_currency: 0,
    from_currency: 1,
  };

  componentDidMount() {
    console.log("INFO: Settings::componentDidMount() called");
    //nothing for now
  }

  componentWillUnmount() {
    console.log("INFO: Settings::componentWillUnmount() called");
    // nothing for now
  }

  handleChange = (param, value) => {
    console.log("INFO: Settings::handleChange() called");
    this.setState({ [param]: value });
    createStoreItem(param.toUpperCase(), currencies[value].label);
  };

  render() {
    return (
      <View style={style.container}>
        <Text style={style.main}>Currency Preference</Text>
        <View style={style.dropDownView}>
          <Text style={style.text}>From</Text>
          <Dropdown
            dropdownPosition={-4}
            containerStyle={style.dropDown}
            useNativeDriver={true}
            selectedItemColor={'blue'}
            itemCount={5}
            itemColor={'red'}
            data={currencies}
            value={this.state.from_currency}
            onChangeText={value => this.handleChange('from_currency', value)}
          />
          <Text style={style.text}>To</Text>
          <Dropdown
            dropdownPosition={-4}
            containerStyle={style.dropDown}
            useNativeDriver={true}
            selectedItemColor={'blue'}
            itemCount={5}
            itemColor={'red'}
            data={currencies}
            value={this.state.to_currency}
            onChangeText={value => this.handleChange('to_currency', value)}
          />
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 30,
    padding: 0,
  },
  dropDownView: {
    flex: .1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 0,
  },
  dropDown: {
    width: 60,
    marginTop: -5,
    marginLeft: 40,
    marginRight: 20,
    alignSelf: "flex-start"
  },
  main: {
    fontWeight: "bold",
    color: "blue",
    fontSize: 16,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "silver",
    fontWeight: "bold",
    alignSelf: "flex-start"
  }
});
