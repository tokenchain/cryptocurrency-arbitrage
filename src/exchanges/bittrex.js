module.exports = (function() {
    "use strict";

    return {
        marketName: 'bittrex',
        URL: 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
        toBTCURL: false,
        pairURL : '',
        lastPrice: function (data, coin_prices) { //Where to find the last price of coin in JSON data
            // return new Promise(function (res, rej) {
                try {
                    for (let obj of data.result) {
                        if(obj["MarketName"].includes('BTC-ETH')) {
                            let coinName = obj["MarketName"].replace("BTC-", '');
                            if (!coin_prices[coinName]) coin_prices[coinName] = {};
                            coin_prices[coinName].bittrex = obj.Last;
                        }
                    }
                    return(coin_prices);
                }
                catch (err) {
                    console.log(err);
                    // rej(err);
                }

            // })
        },

    }
})();