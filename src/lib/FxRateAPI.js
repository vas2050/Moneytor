const axios = require("axios");

const xoomUrl = "https://www.xoom.com/calculate-fee-table";
const xyzUrl = "https://www.xoom.com/calculate-fee-table";
const abcUrl = "https://www.xoom.com/calculate-fee-table";

const getFxRate = async (apiName, params) => {
  console.log("INFO: getFxRate() called");
  if (apiName.toLowerCase() === "xoom") {
    return getRate({url: xoomUrl, ...params});
  }
  else if (apiName.toLowerCase() === "abc") {
    return getRate({url: abcUrl, ...params});
  }
  else if (apiName.toLowerCase() === "xyz") {
    return getRate({url: xyzUrl, ...params});
  }
};

const getRate = async (args) => {
  console.log("INFO: getRate() called");
  const {url, sCountryCode, sCurrencyCode, dCountryCode, dCurrencyCode, sendAmount} = args;
  const params = {
    sourceCountryCode: sCountryCode,
    sourceCurrencyCode: sCurrencyCode,
    destinationCountryCode: dCountryCode,
    destinationCurrencyCode: dCurrencyCode,
    sendAmount
  };

  return axios.get(url, {
    params,
    timeout: 1000 * 40 // time out: 40 sec
  })
  .then(res => {
    const content = JSON.parse(res.data.feeCalculatorContent);
    const fxRate = content.data.fxRate;
    console.log("Fx Rate: ", fxRate);
    return fxRate;
  })
  .catch(err => {
    if (err.code && err.code === 'ECONNABORTED') {
      console.log("ERROR: Timed Out!");
      throw "timeout";
    }
    else {
      console.log("ERROR: getXoomRate()");
      throw "error";
    }
  });
};

// may need to fake sometime to avoid load on third-party APIs
const getRateFake = async (args) => {
  console.log("INFO: getRateFake() called");
  const {url, sCountryCode, sCurrencyCode, dCountryCode, dCurrencyCode, sendAmount} = args;
  const params = {
    sourceCountryCode: sCountryCode,
    sourceCurrencyCode: sCurrencyCode,
    destinationCountryCode: dCountryCode,
    destinationCurrencyCode: dCurrencyCode,
    sendAmount
  };

  // fake it
  const fake = async() => {
    return "75.5555";
  };

  return new Promise(done => setTimeout(() => done(fake()), 6000));
};

export {
  getFxRate
};
