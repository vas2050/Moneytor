import AsyncStorage from '@react-native-community/async-storage';

const readStoreItems = async (key) => {
  console.log("INFO: AppStorage::readStoreItems() called");
  let items = [];
  try {
    const json = await AsyncStorage.getItem(key);
    if (json) {
      const item = JSON.parse(json);
      if (Array.isArray(item)) {
        items = items.concat(item);
      }
      else {
        items.push(item);
      }
    }
  }
  catch (error) {
    console.log(`ERROR: unable to retrieve ${key} from storage!`);
  }

  return items;
};

const createStoreItems = async (key, items) => {
  console.log("INFO: AppStorage::createStoreItems() called");
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
  const items = await readStoreItems(key);
  if (items.length) {
    items.forEach(item => { if (!item.read) ++count; });
  }
  return count;
};

export {
  readStoreItems,
  createStoreItems,
  getUnreadCount
}
