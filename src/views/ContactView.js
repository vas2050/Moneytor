import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

import { Dropdown } from 'react-native-material-dropdown';
import { sendEmail } from '../lib/SendEmail';
import * as RootNavigation from '../lib/NavigationHandler'

const feedback_types = [
  {value: 0, label: 'Choose one'},
  {value: 1, label: 'Comment'},
  {value: 2, label: 'Request'},
  {value: 3, label: 'Problem'},
  {value: 4, label: 'Suggestion'}
];

export default class ContactUs extends Component {
  state = {
    height: 120,
    name: '',
    email: '',
    message: '',
    feedback_type: 0,
    email_error: true,
    name_error: true,
    message_error: true,
    feedback_error: true,
  }

  componentDidMount = () => {
    console.log("INFO: Contact::componentDidMount() called");
    //nothing for now
  };

  componentWillUnmount = () => {
    console.log("INFO: Contact::componentWillUnmount() called");
    // nothing for now
  };

  resetForm = () => {
    this.setState({
      name: '',
      email: '',
      feedback_type: 0,
      message: '',
      email_error: true,
      name_error: true,
      message_error: true,
      feedback_error: true,
    });
  };

  validate = () => {
    if (this.state.name_error) {
      Alert.alert("Error", "Name is either empty or too short!");
      return false;
    }

    if (this.state.email_error) {
      Alert.alert("Error", "Invalid email address!");
      return false;
    }

    if (this.state.feedback_error) {
      Alert.alert("Error", "Invalid feedback type!");
      return false;
    }

    if (this.state.message_error) {
      Alert.alert("Error", "Message is too short!");
      return false;
    }

    return true;
  };

  handleEmail = async () => {
    if (this.validate()) {
      const {name, email, message, feedback_type} = this.state;

      const params = {
        from_name: name,
        from_email: email,
        feedback_type: feedback_types[feedback_type].label,
        message_html: message
      };

      if (sendEmail(params)) {
        Alert.alert("Thank You!", "Your feedback is much appreciated!");
        this.resetForm();
        RootNavigation.navigate('Home', {});
      }
      else {
        Alert.alert("Error", "Unable to submit your feedback!");
      }
    }
  };

  validateInput = (param, value) => {
    if (param === "email") {
      if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        this.setState({email_error: true});
      }
      else {
        this.setState({email_error: false});
      }
    }
    else if (param === "name") {
      if (value.length < 2) {
        this.setState({name_error: true});
      }
      else {
        this.setState({name_error: false});
      }
    }
    else if (param === "message") {
      if (value.length < 10) {
        this.setState({message_error: true});
      }
      else {
        this.setState({message_error: false});
      }
    }
    else if (param === "feedback_type") {
      if (value < 1 || value > 4) {
        this.setState({feedback_error: true});
      }
      else {
        this.setState({feedback_error: false});
      }
    }
  };

  handleChange = (param, value) => {
    this.setState({[param]: value});
    this.validateInput(param, value);
  };

  updateSize = (height) => {
    if (height > 120 && height < 220) {
      this.setState({height});
    }
  };

  render() {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding": "height"} style={style.container}>
        <Text style={style.text}>Name<Text style={{color: "red"}}>*</Text></Text>
        <TextInput
          style={style.textArea}
          maxLength={50}
          value={this.state.name}
          textContentType="name"
          onChangeText={value => this.handleChange('name', value)}
        />
        <Text style={style.text}>Email<Text style={{color: "red"}}>*</Text></Text>
        <TextInput
          style={style.textArea}
          maxLength={60}
          value={this.state.email}
          textContentType="emailAddress"
          onChangeText={value => this.handleChange('email', value)}
        />
        <Text style={style.text}>Feedback Type<Text style={{color: "red"}}>*</Text></Text>
        <Dropdown
          dropdownPosition={-2}
          useNativeDriver={true}
          containerStyle={style.dropDown}
          data={feedback_types}
          value={this.state.feedback_type}
          selectedItemColor={'blue'}
          itemColor={'red'}
          itemCount={5}
          onChangeText={value => this.handleChange('feedback_type', value)}
        />
        <Text style={style.text}>Message<Text style={{color: "red"}}>*</Text></Text>
        <TextInput
          style={[style.textArea, {borderWidth: 1}]}
          height={this.state.height}
          multiline
          scrollEnabled={true}
          maxLength={550}
          onChangeText={value => this.handleChange('message', value)}
          placeholder="Please write your feedback/problems/suggestions in here ..."
          //placeholderTextColor="blue"
          value={this.state.message}
          onContentSizeChange={e => this.updateSize(e.nativeEvent.contentSize.height)}
        />
        <Text style={style.note}>* Maximum: 550 characters, Minimum: 10.</Text>
        <TouchableOpacity
          style={style.buttonView}
          onPress={this.handleEmail}
          activeOpacity={0.2}
        >
          <Text style={style.buttonItem}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    margin: 0,
  },
  buttonView: {
    justifyContent: "center",
    padding: 3,
    margin: 30,
    borderColor: "black",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
  },
  buttonItem: {
    margin: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
    textAlign: "center",
    fontVariant: ['small-caps']
  },
  textArea: {
    width: 300,
    padding: 5,
    fontSize: 20,
    fontFamily: "Arial",
    marginTop: 4,
    color: "black",
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  text: {
    marginTop: 20,
    marginBottom: 0,
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start"
  },
  dropDown: {
    width: 150,
    padding: 0,
    marginTop: -20,
    borderColor: "black",
    borderRadius: 5,
    alignSelf: "flex-end"
  },
  note: {
    marginBottom: 0,
    color: "red",
    fontSize: 8,
    alignSelf: "flex-start"
  }
});
