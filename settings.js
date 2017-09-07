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
    require('./exchanges/bittrex'),
    // require('./exchanges/btc38'),
    //    require('./exchanges/jubi'),
    require('./exchanges/poloniex'),
    require('./exchanges/cryptopia'),
    require('./exchanges/bleutrade'),
    require('./exchanges/kraken'),
    require('./exchanges/bitfinex'),
    require('./exchanges/therocktrading'),
];

let marketNames = [];
for(let i = 0; i < markets.length; i++) { // Loop except cryptowatch
    marketNames.push([[markets[i].marketName], [markets[i].pairURL]]);
}
console.log("Markets:", marketNames);
module.exports = function () {
    this.markets = markets;
    this.marketNames = marketNames;
};
