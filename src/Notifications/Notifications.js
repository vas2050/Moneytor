import firebase from 'react-native-firebase';
import { Alert } from 'react-native';

import { createStoreItems, readStoreItems } from '../AppStorage';

let notificationOpenedListener;
let notificationListener;
let messageListener;

const createNotificationChannel = () => {
  console.log("INFO: Notifications::Notifications::createNotificationChannel() called");
  new firebase
    .notifications
    .Android
    .channel(
      "updates", // channel id
      "Updates Channel", // channel name
      firebase.notifications
      .Android
      .Importance
      .High // channel importance
    )
    .setDescription("This is for getting reminder notifications")
    .then(channel => {
      console.log("INFO: android channel defined");
      firebase
      .notifications()
      .android
      .createChannel(channel)
      .then(() => {
        console.log("INFO: channel created");
      })
      .catch(error => {
        console.log("ERROR: channel create failed");
        console.log(error);
      });
    })
    .catch(error => {
      console.log("ERROR: android channel definition failed");
      console.log(error);
    });
};

const checkPermission = async () => {
  console.log("INFO: Notifications::Notifications::checkPermission() called");
  const enabled = await firebase.messaging().hasPermission();

  if (enabled) {
    console.log("INFO: user has the permission");
    return getToken();
  }
  else {
    console.log("INFO: permission NOT given, requesting again ...");
    return requestPermission();
  }
};

const requestPermission = async () => {
  console.log("INFO: Notifications::Notifications::requestPermission() called");
  let fcmToken;
  try {
    // try getting permission
    await firebase.messaging().requestPermission();
    // user allowed a push notification
    console.log("INFO: permission granted");
    fcmToken = getToken();
  }
  catch(error) {
    console.log("ERROR: request denied");
    alert("Notification is currently disabled, Please enable using settings");
  }
  return fcmToken;
};

// get token and store for future use
const getToken = async () => {
  console.log("INFO: Notifications::Notifications::getToken() called");
  let fcmToken = (await readStoreItems('FCMToken'))[0];
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log("INFO: FCM Token obtained: ", fcmToken);
      createStoreItems('FCMToken', fcmToken)
    }
  }
  return fcmToken;
};

const storeNotification = async notification => {
  console.log("INFO: Notifications::Notifications::storeNotification() called");
  let notif = await readStoreItems('NOTIFs');
  if (notif.length >= 10) { // store only last 5 notifications
    notif.splice(9); // take of older ones
  }

  notif.push(notification);
  createStoreItems('NOTIFs', notif);
};

const createNotificationListeners = async () => {
  console.log("INFO: Notifications::Notifications::createNotificationListeners() called");
  // on receival of notification
  notificatonListener = firebase.notifications().onNotification(async notification => {
    const { title, body, notificationId } = notification;
    let badgeCount = await firebase.notifications().getBadge();
    const localNotification = new firebase.notifications.Notification()
    .setNotificationId(notificationId)
    .setTitle(title)
    .setBody(body);

    let date = new Date;
    date = date.toLocaleString();
    storeNotification({notificationId, title, body, date});

    // display notification
    firebase.notifications()
    .displayNotification(localNotification)
    .then(() => {
      console.log("INFO: notification displayed for " + notificationId);
    })
    .catch(error => console.log("ERROR: notification display: ", error));

    //firebase.notifications().setBadge(++badgeCount);
  });

  // when a notification is opened...
  notificationOpenedListener = firebase.notifications().onNotificationOpened(async notificationOpen => {
    let badgeCount = await firebase.notifications().getBadge();
    firebase.notifications().setBadge(--badgeCount);
    const { title, body } = notificationOpen.notification;
    console.log('INFO: notification opened for ' + notificationOpen.notification.notificationId);
    Alert.alert(title, body)
  });

  // when app is closed 
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
    console.log("INFO: initial notification", notificationOpen);
  }

  // data only message in foreground
  messageListener = firebase.messaging().onMessage(message => {
    //process data
    console.log("INFO: message displayed: ", JSON.stringify(message)); 
  });
};

const scheduleNotification = async (name, schedule) => {
  console.log("INFO: Notifications::Notifications::scheduleNotification() called");
  let secondsToAdd;
  let repeatInterval;
 
  schedule = 'minute'; // for testing
  switch(schedule) {
    case 'daily':
      secondsToAdd = 24*60*60;
      repeatInterval = 'day';
      break;
    case 'weekly':
      secondsToAdd = 7*24*60*60;
      repeatInterval = 'week';
      break;
    case 'monthly':
      secondsToAdd = 4*7*24*60*60;
      repeatInterval = 'month';
      break;
    default:
      secondsToAdd = 60;
      repeatInterval = 'minute';
  }

  const date = new Date();
  date.setSeconds(date.getSeconds() + secondsToAdd);

  const fireDate = date.toISOString();

  // schedule it
  firebase
  .notifications()
  .scheduleNotification(_buildNotification(name), {fireDate, repeatInterval, exact: true})
  .then((sched) => {
    console.log(`INFO: ${name} scheduled for ${schedule}`);
  })
  .catch(error => {
    console.log(`ERROR: scheduling ${name} for ${schedule} failed`);
    console.log(error);
  });
};

const cancelNotification = async (id) => {
  console.log("INFO: Notifications::Notifications::cancelNotification() called");
  firebase
  .notifications()
  .cancelNotification(id)
  .then(() => {
     console.log("INFO: notification canceled for " + id);
  })
  .catch(error => {
    console.log("ERROR: failed to cancel notification for " + id);
    console.log(error);
  });
};

const _buildNotification = (name) => {
  console.log("INFO: Notifications::Notifications::_buildNotification() called");
  //const title = (Platform.OS === "android") ? "Android Updates" : "Apple Updates";
  const title = `Rate updates for ${name}`;
  const body = `The current xchange rate from ${name}: 1 USD = XX INR`;

  // create a new instance
  let notification;
  try {
    notification = 
      new firebase
        .notifications
        .Notification()
        .setNotificationId(name)
        .setTitle(title)
        .setBody(body);
          /*
          .android.setPriority(firebase.notifications.Android.priority.High)
          .android.setChannelId("updates")
          .android.setAutoCancel(true);
          */

    console.log("INFO: notification built for " + name);
  }
  catch (error) {
    console.log("ERROR: building notification failed for " + name);
    console.log(error);

    return false;
  }

  return notification;
};

export {
  createNotificationChannel,
  checkPermission,
  requestPermission,
  getToken,
  scheduleNotification,
  cancelNotification,
  createNotificationListeners,
  notificationOpenedListener,
  notificationListener,
  messageListener
}
