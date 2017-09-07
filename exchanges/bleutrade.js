module.exports = (function() {
    "use strict";

    return {
		marketName: 'bleutrade',
		URL: 'https://bleutrade.com/api/v2/public/getmarketsummaries', //URL To Fetch API From.
		toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        lastPrice: function (data, coin_prices) { //Get the last price of coins in JSON data
			return new Promise(function (res, rej) {
				try {
					for (let obj of data.result) {
						if(obj["MarketName"].includes('_BTC')) {
							let coinName = obj["MarketName"].replace("_BTC", '');
							if (!coin_prices[coinName]) coin_prices[coinName] = {};
							coin_prices[coinName].bleutrade = obj.Last;
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
