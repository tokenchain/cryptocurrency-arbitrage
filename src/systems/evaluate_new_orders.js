class EvaluateNewOrdersSystem 
{
    initialize(world) 
    {
        this.world = world
        this.prices = []
        this.threshold = 0.59
        this.orderAmount = 123
    }

    createNewOrders(coin, exchangesValues, threshold)
    {
        let oldOrdersIds = this.getOldOrdersIds()

        let ordersCount = 0
        let lastIdx = exchangesValues.length - 1

        // the first with the last, the second with the second-last, etc...
        for (let long = 0; long < exchangesValues.length/2; long++) {
            let short = lastIdx - long
            let longFrom = exchangesValues[long][1]
            let shortFrom = exchangesValues[short][1]
            
            let id = this.createOrderId(coin, longFrom, shortFrom)
            if (oldOrdersIds.indexOf(id) >= 0) {
                continue;
            }

            let profit = (exchangesValues[short][0] / exchangesValues[long][0] - 1) * 100;
            if (profit <= threshold) {
                continue;
            }

            this.world.entity()
                .set('order', {
                    id: id,
                    currency: coin,
                    amount: this.orderAmount,
                    longAt: exchangesValues[long][0],
                    longFrom: longFrom,
                    shortAt:  exchangesValues[short][0],
                    shortFrom:  shortFrom,
                    profitForecastPerc: profit.toFixed(2)+'%',
                    time: new Date().getTime()
                })
                .set('newOrder')

            ordersCount += 1
        }

        return ordersCount
    }


    getOldOrdersIds()
    {
        let oldOrders = this.world.get('order')

        return oldOrders.map(function(o) { return o.data.order.id; })
    }


    createOrderId(coin, shortFrom, longFrom)
    {
        return coin + '-L_' + longFrom + '-S_' + shortFrom
    }


    sortPairs(pairs)
    {
        let sorted = [];
        for (let idx in pairs) {
            let pairValue = pairs[idx].get('pairValue')
            sorted.push([pairValue.value, pairValue.exchange.name]);
        }

        sorted.sort(function (a, b) {
            return a[0] - b[0];
        });

        return sorted
    }


    post()
    {
        let coinNames = []
        let ordersCount = []
        let pairs = this.world.get(...this.components)
        let coin = 'ETH'
        // console.log('post')

        pairs = this.sortPairs(pairs)

        ordersCount = this.createNewOrders(coin, pairs, this.threshold)

        if (ordersCount) {
            console.log(ordersCount+' new orders')
        }
    }
}

exports.EvaluateNewOrdersSystem = EvaluateNewOrdersSystem