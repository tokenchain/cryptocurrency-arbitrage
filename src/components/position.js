class PositionComponent
{
    constructor(data) {
        this.id = data.id
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

exports.PositionComponent = PositionComponent