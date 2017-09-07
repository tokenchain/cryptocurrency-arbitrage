module.exports = (function() {
    "use strict";

    return     {
		marketName: 'cryptopia',
		URL: 'https://www.cryptopia.co.nz/api/GetMarkets/BTC', //URL To Fetch API From.
		toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        lastPrice: function (data, coin_prices) { //Get the last price of coins in JSON data
			return new Promise(function (res, rej) {
				try {
					for (let obj of data.Data) {
						if(obj["Label"].includes('/BTC')) {
							let coinName = obj["Label"].replace("/BTC", '');
							if (!coin_prices[coinName]) coin_prices[coinName] = {};
							coin_prices[coinName].cryptopia = obj.LastPrice;
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
