class DoUpdateCoinValueCommand {
    constructor(data) {
        this.exchangeName = data.exchangeName
        this.mainCoin = data.mainCoin
        this.baseCoin = data.baseCoin
        this.value = data.value
    }
}

exports.ExchangeComponent = ExchangeComponent