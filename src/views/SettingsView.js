import React, { Component } from 'react';
import { Dropdown } from 'react-native-material-dropdown'; 
import Slider from '@react-native-community/slider'; 
import {
  Alert,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

import { fromCurrency, toCurrency, symbols } from '../config/CurrencyList';
import { readStoreItem, createStoreItem } from '../lib/AppStorage';
import * as Notifications from '../lib/NotificationHandler';

export default class Settings extends Component {
  state = {
    to: 0,
    from: 0, 
    min: null,
    max: null,
    sendAmount: null,
    handle: null,
  };

  componentDidMount = () => {
    console.log("INFO: Settings::componentDidMount() called");
    console.log("Settings: ", this.props);
    const {to, from, sendAmount, min, max, handle} = this.props;
    this.setState({to, from, sendAmount, min, max, handle});
  };

  componentWillUnmount = () => {
    console.log("INFO: Settings::componentWillUnmount() called");
  };

  handleChange = (param, value) => {
    console.log("INFO: Settings::handleChange() called");
    this.setState({[param]: value});
    this.state.handle(this.state);
  };

  // for tracking purpose, don't store
  handleTrackChange = (param, value) => {
    console.log("INFO: Settings::handleChange() called");
    this.setState({[param]: value});
  };

  render() {
    return (
      <View style={style.container}>
        <Text style={style.main}>Preferences</Text>
        <View style={{marginTop: 20, borderTopWidth: 1, borderColor: "silver"}}>
          <View style={style.dropDownView}>
            <Text style={style.text}>From</Text>
            <Dropdown
              itemTextStyle={{fontWeight: "bold"}}
              dropdownPosition={-4}
              containerStyle={style.dropDown}
              useNativeDriver={true}
              selectedItemColor={'blue'}
              itemCount={5}
              //itemColor={'red'}
              data={fromCurrency}
              value={this.state.from}
              onChangeText={value => this.handleChange('from', value)}
            />
            <Text style={style.text}>To</Text>
            <Dropdown
              itemTextStyle={{fontWeight: "bold"}}
              dropdownPosition={-4}
              containerStyle={style.dropDown}
              useNativeDriver={true}
              selectedItemColor={'blue'}
              itemCount={5}
              //itemColor={'red'}
              data={toCurrency}
              value={this.state.to}
              onChangeText={value => this.handleChange('to', value)}
            />
          </View>
          <View style={{marginTop: 20, borderTopWidth: 1, borderColor: "silver"}}>
            <Text style={style.text}>Amount (to calculate the Rate for):</Text>
            <View style={style.limit}>
              <Text style={style.textLimit}>{symbols[fromCurrency[this.state.from].code]}</Text>
              <Text style={style.text}>{this.state.sendAmount}</Text>
              <Slider
                disabled={true}
                step={50}
                minimumValue={50}
                minimumTrackTintColor="green"
                maximumValue={9999}
                maximumTrackTintColor="gray"
                thumbTintColor="blue"
                value={this.state.sendAmount}
                onSlidingComplete={value => this.handleChange('sendAmount', value)}
                onValueChange={value => this.handleTrackChange('sendAmount', value)}
                style={style.slider}
                useNativeDriver={true}
              />
            </View>
          </View>
          <View style={{marginTop: 20, borderTopWidth: 1, borderColor: "silver"}}>
            <Text style={style.text}>When to notify?</Text>
            <View style={style.limit}>
              <Text style={style.textLimit}>{symbols[toCurrency[this.state.to].code]}</Text>
              <TextInput
                keyboardType="numeric"
                style={style.textInput}
                maxLength={7}
                autoGrow={true}
                maxHeight={50}
                value={this.state.min}
                onChangeText={value => this.handleChange('min', value)}
              />
              <Text style={style.textLimit}>&ge;</Text>
              <Text style={style.textLimit}>Fx Rate</Text>
              <Text style={style.textLimit}>&ge;</Text>
              <Text style={style.textLimit}>{symbols[toCurrency[this.state.to].code]}</Text>
              <TextInput
                keyboardType="numeric"
                style={style.textInput}
                maxLength={7}
                value={this.state.max}
                onChangeText={value => this.handleChange('max', value)}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    margin: 30,
    padding: 0,
  },
  dropDownView: {
    flex: .2,
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
    color: "silver",
    fontSize: 18,
  },
  textInput: {
    borderBottomWidth: 1,
    marginTop: 20,
    marginRight: 10,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    alignSelf: "flex-start"
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    alignSelf: "flex-start"
  },
  limit: {
    flex: .1,
    flexDirection: "row"
  },
  textLimit: {
    fontSize: 16,
    color: "blue",
    fontWeight: "bold",
    marginTop: 20,
    marginRight: 10,
  },
  slider: {
    width: 240,
    height: 50,
    borderBottomWidth: 2,
    marginTop: 30,
  },
});
