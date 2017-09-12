module.exports = (function() {
    "use strict";

    return     {
        marketName: 'jubi',
        URL: 'https://www.jubi.com/api/v1/allticker/', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        lastPrice: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
            return new Promise(function (res, rej) {
                let priceOfBTC = data.btc.last;
                console.log(priceOfBTC);
                try {
                    for (let key in data) {
                        let coinName = key.toUpperCase();
                        let price = data[key].last;
                        if (!coin_prices[coinName]) coin_prices[coinName] = {};

                        coin_prices[coinName]["jubi"] = data[key].last / priceOfBTC;
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
