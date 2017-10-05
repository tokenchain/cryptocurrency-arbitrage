class EvaluateNewOrdersSystem 
{
    initialize(world) 
    {
        this.world = world
        this.prices = []
        this.threshold = 0.1
        this.orderAmount = 123
    }
    
    every(pair) 
    {
        // console.log('show', this.world.index.query(this.components))
        // console.log(pair)
    }

    createNewOrders(coin, data, threshold)
    {
        let oldOrders = this.world.get('order')

        let ordersCount = 0
        let movement = {}
        let lastIdx = data.length - 1

        // the first with the last, the second with the second-last
        for (let long = 0; long < data.length/2; long++) {
            let short = lastIdx - long
            let profit = (data[short][0] / data[long][0] - 1) * 100;

            if (profit <= threshold) {
                continue;
            }

            this.world.entity()
                .set('order', {
                    currency: coin,
                    amount: this.orderAmount,
                    longAt: data[long][0],
                    longFrom: data[long][1],
                    shortAt:  data[short][0],
                    shortFrom:  data[short][1],
                    profitForecastPerc: profit.toFixed(2)+'%',
                    time: '2017-10-03 23:25'
                })

            ordersCount++;
        }
        return ordersCount
    }

    sortPairs(pairs)
    {
        let sorted = [];
        for (let idx in pairs) {
            let pairValue = pairs[idx].get('pairValue')
            sorted.push([pairValue.value, pairValue.exchange]);
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

        console.log(ordersCount+' orders')
    }
}

exports.EvaluateNewOrdersSystem = EvaluateNewOrdersSystem