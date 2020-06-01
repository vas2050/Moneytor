import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

export default class ContactUs extends Component {
  componentDidMount = () => {
    console.log("INFO: Contact::componentDidMount() called");
    //nothing for now
  };

  componentWillUnmount = () => {
    console.log("INFO: Contact::componentWillUnmount() called");
    // nothing for now
  };

  render() {
    return (
      <View style={style.container}>
        <TouchableOpacity
          style={style.buttonView}
          onPress={() => Alert.alert("Thank you for your feedback!")}
          activeOpacity={0.2}
        >
          <Text style={style.buttonItem}>Email Us</Text>
        </TouchableOpacity>
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
    margin: 0
  },
  buttonView: {
    justifyContent: "center",
    padding: 3,
    margin: 10,
    borderColor: "black",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    //borderColor: "blue",
    //borderStyle: "solid",
  },
  buttonItem: {
    //width: 50,
    margin: 10,
    fontSize: 14,
    //fontWeight: "bold",
    color: "blue",
    textAlign: "center",
    fontVariant: ['small-caps']
  },
  note: {
    marginTop: 10,
    color: "black",
    fontWeight: "bold",
    alignSelf: "center"
  }
});
