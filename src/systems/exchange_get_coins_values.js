class ExchangeGetCoinsValuesSystem {
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
        let opts = this.opts
                opts.url = exchange.lastPriceUrl
                let world = this.world

                this.request(opts, function (error, response, body) {
        
                    if (error) console.log(error)

                    try {
                        let data = JSON.parse(body);
                        let newCoinPrices = exchange.getLastPrice(data, {});

                        // TODO: extract the following code into a new "talking" method
                        let receivedCoins = Object.keys(newCoinPrices)
                        for (let mainCoin in receivedCoins) {

                            let coin = receivedCoins[mainCoin]
                            let pairs = world.every(['pairValue', exchange.name])

                            for (let pair of pairs) {
                                let p = pair.access('pairValue')
                                p.value = newCoinPrices[coin][exchange.name]
                                p.state = 'ready'
                            }
                        }    
        
                    } catch (error) {
                        // TODO: manage the "loss of communication" error updating coins entities 
                        console.error(error);
                    }
                });
        
        

//        console.log(price)
    }
}

exports.ExchangeGetCoinsValuesSystem = ExchangeGetCoinsValuesSystem