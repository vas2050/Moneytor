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

export default class Settings extends Component {
  state = {
    to_currency: 0,
    from_currency: 0,
    min_limit: null,
    max_limit: null,
    send_amount: null
  };

  componentDidMount() {
    console.log("INFO: Settings::componentDidMount() called");
    this.getDefaults();
  }

  componentWillUnmount() {
    console.log("INFO: Settings::componentWillUnmount() called");
    /*
    createStoreItem("MIN_LIMIT", this.state.min_limit);
    createStoreItem("MAX_LIMIT", this.state.max_limit);
    createStoreItem("TO_CURRENCY", this.state.to_currency);
    createStoreItem("FROM_CURRENCY", this.state.from_currency);
    */
  }

  getDefaults = async () => {
    let min_limit = await readStoreItem("MIN_LIMIT");
    let max_limit = await readStoreItem("MAX_LIMIT");
    min_limit = min_limit || "0.00";
    max_limit = max_limit || "0.00";
    let to_currency = await readStoreItem("TO_CURRENCY");
    let from_currency = await readStoreItem("FROM_CURRENCY");
    to_currency = to_currency || 0;
    from_currency = from_currency || 0;
    let send_amount = await readStoreItem("SEND_AMOUNT");
    send_amount = send_amount || 2000;
    this.setState({ min_limit, max_limit, to_currency, from_currency, send_amount });
  };

  handleCurrencyChange = (param, value) => {
    console.log("INFO: Settings::handleCurrencyChange() called");
    this.setState({[param]: value});
    createStoreItem(param.toUpperCase(), value);
  };

  handleLimitChange = (param, value) => {
    console.log("INFO: Settings::handleLimitChange() called");
    this.setState({[param]: value});
    createStoreItem(param.toUpperCase(), value);
  };

  // for tracking purpose, don't store
  handleChange = (param, value) => {
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
              value={this.state.from_currency}
              onChangeText={value => this.handleCurrencyChange('from_currency', value)}
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
              value={this.state.to_currency}
              onChangeText={value => this.handleCurrencyChange('to_currency', value)}
            />
          </View>
          <View style={{marginTop: 20, borderTopWidth: 1, borderColor: "silver"}}>
            <Text style={style.text}>Amount (to calculate the Rate for):</Text>
            <View style={style.limit}>
              <Text style={style.textLimit}>{symbols[fromCurrency[this.state.from_currency].code]}</Text>
              <Text style={style.text}>{this.state.send_amount}</Text>
              <Slider
                disabled={true}
                step={50}
                minimumValue={50}
                minimumTrackTintColor="green"
                maximumValue={9999}
                maximumTrackTintColor="gray"
                thumbTintColor="blue"
                value={this.state.send_amount}
                onSlidingComplete={value => this.handleLimitChange('send_amount', value)}
                onValueChange={value => this.handleChange('send_amount', value)}
                style={style.slider}
                useNativeDriver={true}
              />
            </View>
          </View>
          <View style={{marginTop: 20, borderTopWidth: 1, borderColor: "silver"}}>
            <Text style={style.text}>When to notify?</Text>
            <View style={style.limit}>
              <Text style={style.textLimit}>{symbols[toCurrency[this.state.to_currency].code]}</Text>
              <TextInput
                keyboardType="numeric"
                style={style.textInput}
                maxLength={7}
                autoGrow={true}
                maxHeight={50}
                value={this.state.min_limit}
                onChangeText={value => this.handleLimitChange('min_limit', value)}
              />
              <Text style={style.textLimit}>&ge;</Text>
              <Text style={style.textLimit}>Fx Rate</Text>
              <Text style={style.textLimit}>&ge;</Text>
              <Text style={style.textLimit}>{symbols[toCurrency[this.state.to_currency].code]}</Text>
              <TextInput
                keyboardType="numeric"
                style={style.textInput}
                maxLength={7}
                value={this.state.max_limit}
                onChangeText={value => this.handleLimitChange('max_limit', value)}
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
