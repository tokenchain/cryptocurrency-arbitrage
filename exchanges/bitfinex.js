module.exports = (function() {
    "use strict";

    return {
        marketName: 'bitfinex', 
        URL: 'https://api.bitfinex.com/v2/tickers?symbols=tDASHBTC,tEOSBTC,tGNOBTC,tETCBTC,tETHBTC,tLTCBTC,tMLNBTC,tREPBTC,tXDGBTC,tXLMBTC,tXMRBTC,tXRPBTC,tZECBTC', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        lastPrice: function (data, coin_prices) { //Get the last price of coins in JSON data
            return new Promise(function (res, rej) {
                try {
                    for (let key in data.result) {
                        let arr = key.match(/DASH|EOS|GNO|ETC|ETH|LTC|MLN|REP|XDG|XLM|XMR|XRP|ZEC/); // matching real names to weird kraken api coin pairs like "XETCXXBT" etc 
                        let name = key;
                        let matchedName = arr[0];
                        if (matchedName === "XDG") { //kraken calls DOGE "XDG" for whatever reason
                            let matchedName = "DOGE";
                            var coinName = matchedName;
                        } else {
                            var coinName = matchedName;
                        }

                        if (!coin_prices[coinName]) coin_prices[coinName] = {};
                        
                        coin_prices[coinName].kraken = data.result[name].c[0];

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
