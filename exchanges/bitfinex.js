module.exports = (function() {
    "use strict";

/*
[
    SYMBOL,
    BID, 
    BID_SIZE, 
    ASK, 
    ASK_SIZE, 
    DAILY_CHANGE, 
    DAILY_CHANGE_PERC, 
    LAST_PRICE, 
    VOLUME, 
    HIGH, 
    LOW
],
*/

    return {
        marketName: 'bitfinex', 
        URL: 'https://api.bitfinex.com/v2/tickers?symbols=tDASHBTC,tEOSBTC,tGNOBTC,tETCBTC,tETHBTC,tLTCBTC,tMLNBTC,tREPBTC,tXDGBTC,tXLMBTC,tXMRBTC,tXRPBTC,tZECBTC', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        lastPrice: function (data, coin_prices) { //Get the last price of coins in JSON data
            return new Promise(function (res, rej) {

                //console.log(data)
                
                try {
                    for (let coin of data) {
                        
                        let coinName = coin[0].substring(1).replace('BTC','').toUpperCase();
                        let price = coin[7];

                        if (!coin_prices[coinName]) coin_prices[coinName] = {};

                        coin_prices[coinName]["bitfinex"] = price;
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
