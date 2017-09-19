module.exports = (function() {
    "use strict";

    return {
        marketName: 'gdax', 
        URL: 'https://api.gdax.com/products/ETH-BTC/ticker', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        lastPrice: function (data, coin_prices) { //Get the last price of coins in JSON data
            return new Promise(function (res, rej) {
                try {
                    let coinName = 'ETH';
                    let price = data['price'];

                    if (!coin_prices[coinName]) coin_prices[coinName] = {};

                    coin_prices[coinName]["gdax"] = price;

                    res(coin_prices);

                }
                catch (err) {
                    console.error(err);
                    rej(err);
                }
            })
        }
    }
})();
