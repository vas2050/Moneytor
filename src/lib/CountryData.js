import { fromCurrency, toCurrency, symbols } from '../config/CurrencyList';
//import { readStoreItem, createStoreItem } from './AppStorage';

export const getCountry = async (to, from) => {
  console.log("INFO: getCountry() called");
  /*
   * previous code before having implemented the props passing from
   * Settings -> App -> Home
 
      let to = await readStoreItem("TO_CURRENCY");
      to = to || 0;

      let from = await readStoreItem("FROM_CURRENCY");
      from = from || 0;

      let sendAmount = await readStoreItem("SEND_AMOUNT");
      sendAmount = sendAmount || 2000;
  *
  *
  */

  const sCountryCode = fromCurrency[from].code;
  const dCountryCode = toCurrency[to].code;
  const sCurrencyCode = fromCurrency[from].label;
  const dCurrencyCode = toCurrency[to].label;
  const sCurrencySign = symbols[sCountryCode];
  const dCurrencySign = symbols[dCountryCode];

  const country = {
    sCountryCode,
    dCountryCode,
    sCurrencyCode,
    dCurrencyCode,
    sCurrencySign,
    dCurrencySign
  };

  return country;
};
