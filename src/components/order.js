class OrderComponent 
{
    constructor(data) {
        this.id = data.currency + '-L_' + data.longFrom + '-S_' + data.shortFrom;
        this.currency = data.currency;
        this.longAt = data.longAt;
        this.longFrom = data.longFrom;
        this.shortAt = data.shortAt;
        this.shortFrom = data.shortFrom;
        this.amount = data.amount;
        this.profitForecastPerc = data.profitForecastPerc;
        this.time = data.time;
    }
}

exports.OrderComponent = OrderComponent