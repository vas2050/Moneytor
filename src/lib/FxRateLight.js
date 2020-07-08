import { getFxRate } from './FxRateAPI';
import { readStoreItem, createStoreItem } from './AppStorage';

const timeNow = async => {
  const date = new Date();
  return Math.round(date.getTime()/1000);
};

export const getFxRateLight = async (name, params) => {
  console.log("INFO: getFxRateLight() called");
  const { sendAmount } = params;
  const item = [name.toUpperCase(), sendAmount, "RATE"].join("_");
	const value = await readStoreItem(item);
  const now = await timeNow();
  if (value) {
  	const [rate, then] = value.split(":");
    if (then && now) {
			if (now - then <= 2*60*60) { // the stored rate is within the last two hours
  			console.log("INFO: Old rate: " + rate);
        // simply wait 1s for spinner to work :)
        return new Promise(done => setTimeout(() => done(rate), 1000));
			}
		}
	}

  // no previously stored rate or 2 hrs old
  return getFxRate(name, params)
  .then(rate => {
    console.log("INFO: New rate: " + rate);
    createStoreItem(item, [rate, now].join(":"));
    return rate;
  })
  .catch(err => err);
};
