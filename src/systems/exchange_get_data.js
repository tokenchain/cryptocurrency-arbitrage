class ExchangeGetDataSystem {
	initialize(world, request) {
        this.world = world
		this.request = request
        this.opts = {
            'url': null,
            'headers': {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
            }
        }
    }
    
    every(exchange) {
        // console.log('world',this.world)
        // let pricePromise = exchange.getLastPrice('ETH', 'BTC')
        let opts = this.opts
                opts.url = exchange.lastPriceUrl
                let world = this.world

                this.request(opts, function (error, response, body) {
        
                    if (error) console.log(error)

                    try {
                        let data = JSON.parse(body);
                        let newCoinPrices = exchange.getLastPrice(data, {});

                        let receivedCoins = Object.keys(newCoinPrices)
                        for (let mainCoin in receivedCoins) {

                            let coin = receivedCoins[mainCoin]
                            let pairs = world.every(['pairValue', exchange.name])

                            for (let pair of pairs) {
                                pair.access('pairValue').value = newCoinPrices[coin][exchange.name]
                            }
                        }    
                        // console.log('newCoinPrices',newCoinPrices);        
        
                    } catch (error) {
                        //log.info("Error getting JSON response from", options.URL, error); //Throws error
                        console.error(error);
                    }
                });
        
        

//        console.log(price)
    }
}

exports.ExchangeGetDataSystem = ExchangeGetDataSystem