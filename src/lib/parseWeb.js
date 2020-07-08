const puppeteer = require("puppeteer");

const xoomPage = async (toCountry, fromCurrency, amount) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://xoom.com/${toCountry}/send-money`);
  await page.waitFor("input[name=sendAmount]");
  await page.evaluate(val => document.querySelector("#sendAmount").value = val, amount);

  await page.select("#sourceCurrencyCode", fromCurrency);
  await page.click("#receiveAmount");
  await page.screenshot({path: 'example.png'});
  await browser.close();
};

module.exports = {
  xoomPage
};
