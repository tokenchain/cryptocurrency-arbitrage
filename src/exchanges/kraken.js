module.exports = (function() {
    "use strict";

    return{
        marketName: 'kraken', // kraken has no one size fits all market summery so each pair has to be entered as param in GET - will need to add new coins as they are added to exchange
        //URL: 'https://api.kraken.com/0/public/Ticker?pair=DASHXBT,EOSXBT,GNOXBT,ETCXBT,ETHXBT,ICNXBT,LTCXBT,MLNXBT,REPXBT,XDGXBT,XLMXBT,XMRXBT,XRPXBT,ZECXBT', //URL To Fetch API From.
        URL: 'https://api.kraken.com/0/public/Ticker?pair=ETHXBT', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        lastPrice: function (data, coin_prices) { //Get the last price of coins in JSON data
            return new Promise(function (res, rej) {
                try {
                    for (let name in data.result) {
                        let arr = name.match(/ETH/); // matching real names to weird kraken api coin pairs like "XETCXXBT" etc 
                        let coinName = arr[0];

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
