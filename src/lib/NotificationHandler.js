import firebase from 'react-native-firebase';
import events from 'events';
import { Alert } from 'react-native';

import { createStoreItem, readStoreItem, removeStoreItem } from './AppStorage';
import * as RootNavigation from './NavigationHandler';
import { getFxRateLight } from '../lib/FxRateLight';
import { getCountry } from '../lib/CountryData';

let notificationOpenedListener;
let notificationListener;
let messageListener;

const eventEmitter = events.EventEmitter();

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
  let fcmToken = await readStoreItem('FCMToken');
  if (!fcmToken) {
    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log("INFO: FCM Token obtained: ", fcmToken);
      createStoreItem('FCMToken', fcmToken)
    }
  }
  return fcmToken;
};

const storeNotification = async message => {
  console.log("INFO: Notifications::Notifications::storeNotification() called");
  const notif = await readStoreItem('NOTIFs');
  let obj = {};
  if (notif) {
    let items = Object.keys(notif);
    if (items && items.length >= 20) { // store only last 20 notifications
      items.sort((a,b) => b-a);
      items = items.slice(0,19); // take latest 19 items
    }
    items.forEach(item => obj[item] = notif[item]);
  }

  obj[message.id] = message; // 20th item
  createStoreItem('NOTIFs', obj);
};

const createNotificationListeners = async (props) => {
  console.log("INFO: Notifications::Notifications::createNotificationListeners() called");
  // on receival of notification
  notificatonListener = firebase.notifications().onNotification(async notification => {
    const { title, body, notificationId } = notification;
    let badgeCount = await firebase.notifications().getBadge();
    const localNotification = new firebase.notifications.Notification()
    .setNotificationId(notificationId)
    .setTitle(title)
    .setBody(body);

    const d = new Date;
    const date = d.toDateString();
    const time = d.toLocaleTimeString();
    const epoch = Math.round(d/1000);
    storeNotification({id: epoch, notificationId, title, body, date, time});

    // no need to increase if already 20 as we show only two maximum
    if (badgeCount < 20) {
      firebase.notifications().setBadge(++badgeCount);
    }

    console.log("emit", eventEmitter.emit("updateBadge"));

    // display notification
    firebase.notifications()
    .displayNotification(localNotification)
    .then(() => {
      console.log("INFO: notification displayed for " + notificationId);
    })
    .catch(error => console.log("ERROR: notification display: ", error));
  });

  // when a notification is opened...
  notificationOpenedListener = firebase.notifications().onNotificationOpened(async notificationOpen => {
    let badgeCount = await firebase.notifications().getBadge();
    firebase.notifications().setBadge(--badgeCount);
    //const { title, body } = notificationOpen.notification;
    console.log('INFO: notification opened for ' + notificationOpen.notification.notificationId);
    RootNavigation.navigate('Alerts', { t: "342"});
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

const runSchedule = async (name, schedule) => {
  console.log("INFO: Notifications::Notifications::runSchedule() called");
  const date = new Date();
  const fireDate = date.getTime() + 4000; // delay 4s

  // schedule it, run only once, not repeatedly due to value: "0"
  firebase
  .notifications()
  .scheduleNotification(await _buildNotification(name), {fireDate, repeatInterval: "0", exact: true})
  .then((sched) => {
    console.log(`INFO: ${name} scheduled for ${schedule}`);
    return true;
  })
  .catch(error => {
    console.log(error);
    console.log(`ERROR: scheduling ${name} for ${schedule} failed`);
    return false;
  });
};

const scheduleNotification = async (name, schedule) => {
  console.log("INFO: Notifications::Notifications::scheduleNotification() called");
  const key = "TIMER_ID_" + name.toUpperCase();
  schedule = 'minly'; // for testing
  let timeToWait = 60; // ms
  switch(schedule) {
    case 'daily':
      timeToWait = 24*60*60;
      break;
    case 'weekly':
      timeToWait = 7*24*60*60;
      break;
    case 'monthly':
      timeToWait = 4*7*24*60*60;
      break;
    default:
      timeToWait = 60;
  }
  timeToWait *= 1000; // to seconds
  const timerId = setInterval(() => runSchedule(name, schedule), timeToWait);
  if (timerId) {
    console.log("INFO: timer id to store: " + timerId);
    createStoreItem(key, timerId);
  }
};

const cancelNotification = async (name) => {
  console.log("INFO: Notifications::Notifications::cancelNotification() called");
  const key = "TIMER_ID_" + name.toUpperCase();
  const timerId = await readStoreItem(key);
  if (timerId) {
    console.log("INFO: timer id to remove: " + timerId);
    console.log("INFO: notification canceled for " + name);
    clearInterval(timerId);
    await removeStoreItem(key);
  }

  /*
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
  */
};

const _buildNotification = async (name) => {
  console.log("INFO: Notifications::Notifications::_buildNotification() called");
  //const title = (Platform.OS === "android") ? "Android Updates" : "Apple Updates";
  const countryObj = await getCountry();
  let fxRate = null;
  try {
    fxRate = await getFxRateLight(name, countryObj); 
  }
  catch(err) {
    console.log("ERROR: ", err);
    console.log("ERROR: unable to fetch fxRate");
  }

  if (fxRate) {
    const title = `Fx Rate updates for ${name}`;
    const { sCountryCode, sCurrencySign, dCurrencySign } = countryObj;
    const body = `The current xchange rate (${name}): ${sCountryCode}${sCurrencySign} 1.00 = ${dCurrencySign} ${fxRate}`;

    // create a new instance
    let notification = null;
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
  }
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
  messageListener,
}
