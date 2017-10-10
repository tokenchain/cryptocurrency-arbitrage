class ShortPositionComponent
{
    constructor(data) 
    {
        this.id = data.id
        this.currency = data.currency;
        this.price = data.price;
        this.amount = data.amount;
        this.exchange = data.exchange;
        this.time = data.time;
    }
}

exports.ShortPositionComponent = ShortPositionComponent