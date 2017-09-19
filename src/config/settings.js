//
// let boilerPlateMarket =
// {
//     marketName: '',
//     URL: '', //URL To Fetch API From.
//     toBTCURL: false, //URL, if needed for an external bitcoin price api.
//     last: function (data, coin_prices) { //Get the last price of coins in JSON data
//         return new Promise(function (res, rej) {
//             try {
//                 for (x in / of data) {
//                     price = ...;
//                     coin_prices[coinName][marketName] = price;
//                 }
//                 res(coin_prices);
//             }
//             catch (err) {
//                 rej(err);
//             }
//
//         })
//     },
//
//
// }

let markets = [
    require('../exchanges/bittrex'),
    // require('../exchanges/btc38'),
    //    require('../exchanges/jubi'),
    require('../exchanges/poloniex'),
    // require('../exchanges/bleutrade'),
    //require('../exchanges/kraken'),
    require('../exchanges/bitfinex'),
    require('../exchanges/therocktrading'),
    require('../exchanges/cexio'),
    require('../exchanges/gdax'),
    // funzionante ma poche transazioni require('../exchanges/gatecoin'),
    require('../exchanges/hitbtc'),
    // funzionante ma poche transazioni require('../exchanges/quoine'),
    require('../exchanges/exmo'),
    require('../exchanges/binance'),
    require('../exchanges/tidex'),
    require('../exchanges/gemini'),
    require('../exchanges/liqui'),
    require('../exchanges/bitflyer'),
    //require('../exchanges/shapeshift'), //https://shapeshift.io/marketinfo/eth_btc
    //require('../exchanges/okcoin'),
    //require('../exchanges/bitflyer'),
    //require('../exchanges/bitstamp'),
    //require('../exchanges/bitinstant'),
    //require('../exchanges/bitbay'),
];

let marketNames = [];
for(let i = 0; i < markets.length; i++) { 
    marketNames.push([[markets[i].marketName], [markets[i].pairURL]]);
}

module.exports = function () {
    this.markets = markets;
    this.marketNames = marketNames;
};
