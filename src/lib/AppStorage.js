import AsyncStorage from '@react-native-community/async-storage';

const readStoreItem = async (key) => {
  console.log("INFO: AppStorage::readStoreItem() called");
  let item;
  try {
    const json = await AsyncStorage.getItem(key);
    if (json) {
      item = JSON.parse(json);
    }
  }
  catch (error) {
    console.log(`ERROR: unable to retrieve ${key} from storage!`);
  }

  return item;
};

const createStoreItem = async (key, items) => {
  console.log("INFO: AppStorage::createStoreItem() called");
  AsyncStorage.setItem(key, JSON.stringify(items))
  .then(() => {
    console.log(`INFO: ${key} stored`);
    return true;
  })
  .catch(err => {
    console.log(`ERROR: unable to store ${key}`);
    return false;
  });
};

const getUnreadCount = async (key) => {
  console.log("INFO: AppStorage::getUnreadCount() called");
  let count = 0;
  const notif = await readStoreItem(key);
  if (notif) {
    const items = Object.keys(notif);
    if (items.length) {
      items.forEach(item => { if (!notif[item].read) ++count; });
    }
  }
  return count;
};

export {
  readStoreItem,
  createStoreItem,
  getUnreadCount
}
