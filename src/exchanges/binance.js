module.exports = (function() {
    "use strict";

    return{
        marketName: 'binance', // kraken has no one size fits all market summery so each pair has to be entered as param in GET - will need to add new coins as they are added to exchange
        URL: 'https://www.binance.com/api/v1/ticker/24hr?symbol=ETHBTC', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        lastPrice: function (data, coin_prices) { //Get the last price of coins in JSON data

            return new Promise(function (res, rej) {
                try {
                    for (let key in data) {
                        let coin = data;
                        let coinName = 'ETH';

                        if (!coin_prices[coinName]) coin_prices[coinName] = {};
                        
                        coin_prices[coinName].binance = coin['lastPrice'];
                        
                        break;

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
