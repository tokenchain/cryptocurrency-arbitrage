module.exports = (function() {
    "use strict";

    return     {
        marketName: 'poloniex',
        URL: 'https://poloniex.com/public?command=returnTicker',
        toBTCURL: false,
        pairURL : '',
        lastPrice: function (data, coin_prices) { //Where to find the last price of coin in JSON data
            return new Promise(function (res, rej) {
                try {
                    for (var obj in data) {
                        if(obj.includes('BTC_')&&obj!=="BTC_EMC2") {
                            let coinName = obj.replace("BTC_", '');
                            if (!coin_prices[coinName]) coin_prices[coinName] = {};
                            coin_prices[coinName].poloniex = data[obj].last;
                        }
                    }
                    res(coin_prices);
                }
                catch (err) {
                    console.log(err);
                    rej(err);
                }

            })
        },

    }
})();
