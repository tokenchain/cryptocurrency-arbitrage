module.exports = (function() {
    "use strict";

    return {
        marketName: 'btc38',
        URL: 'http://api.btc38.com/v1/ticker.php?c=all&mk_type=cny',
        toBTCURL: false,
        pairURL : '',
        lastPrice: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
            return new Promise(function (res, rej) {
                let priceOfBTC = data.btc.ticker.last;
                try {
                    for (let key in data) {
                        let coinName = key.toUpperCase();
                        let price = data[key]['ticker'].last;
                        if (!coin_prices[coinName]) coin_prices[coinName] = {};

                        coin_prices[coinName]["btc38"] = data[key]['ticker'].last / priceOfBTC;
                    }
                    res(coin_prices);
                }

                catch (err) {
                    console.log(err);
                    rej(err)
                }
            })
        }
    }
})();