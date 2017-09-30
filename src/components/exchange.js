class ExchangeComponent {
    constructor(data) {
        this.name = data.name, 
        this.lastPriceUrl = data.lastPriceUrl, 
        this.lastPriceFn = data.lastPriceFunction
        this.bidPriceFn = data.bidPriceFunction
        this.askPriceFn = data.askPriceFunction
    }

    getLastPrice(data, prices) {
        return this.lastPriceFn(data, prices)
    }

    getAskPrice(currencyUp, currencyDown) {
        return this.askPriceFn()
    }

    getBidPrice(currencyUp, currencyDown) {
        return this.bidPriceFn()
    }

    toString() {
        return this.name
    }
}

exports.ExchangeComponent = ExchangeComponent