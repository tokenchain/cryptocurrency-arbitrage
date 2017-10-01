class PairValue {

    constructor(data) {
        this.mainCoin = data.mainCoin
        this.baseCoin = data.baseCoin
        this.value = data.value
        this.state = data.status
    }
}

exports.PairValue = PairValue