class PairValue 
{
    constructor(data) 
    {
        this.mainCoin = data.mainCoin
        this.baseCoin = data.baseCoin
        this.value = data.value
        this.exchange = data.exchange
    }
}

exports.PairValue = PairValue