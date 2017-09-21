module.exports = (function() {
    "use strict";

    return{
        marketName: 'gatecoin', // kraken has no one size fits all market summery so each pair has to be entered as param in GET - will need to add new coins as they are added to exchange
        URL: 'https://api.gatecoin.com/Public/LiveTickers', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        lastPrice: function (data, coin_prices) { //Get the last price of coins in JSON data

//console.log(data)
/*
{"tickers":[
    {"currencyPair":"BTCEUR","open":2928.3,"last":2996.1,"lastQ":0.32,"high":3160.9,"low":2366.2,"volume":1343.73920285,"volumn":1343.73920285,"bid":2893.9,"bidQ":0.1,"ask":3153.4,"askQ":0.101,"vwap":2787.1413135541980589466583487,"createDateTime":"1505494143"},
    {"currencyPair":"BTCHKD","open":26799.0,"last":27456,"lastQ":0.14340041,"high":28600.0,"low":22801.0,"volume":1336.58331416,"volumn":1336.58331416,"bid":26813,"bidQ":0.059,"ask":28502,"askQ":1.823,"vwap":25261.26860882915153808910692,"createDateTime":"1505494143"}
]}
*/
            return new Promise(function (res, rej) {
                try {
                    for (let key in data.tickers) {
                        let coin = data.tickers[key];
                        
                        if( coin["currencyPair"].includes('ETHBTC')) {

                            var coinName = 'ETH';

                            if (!coin_prices[coinName]) coin_prices[coinName] = {};
                            
                            coin_prices[coinName].gatecoin = coin['last'];
                            
                            break;
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
