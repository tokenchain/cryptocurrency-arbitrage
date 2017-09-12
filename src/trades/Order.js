// a Order class using ES6 class syntax
class Order {  
    constructor(currency, amount, buyFrom, sellFrom, time) {
        this.id = currency + '-' + buyFrom + '-' + sellFrom;
        this.currency = currency;
        this.buyFrom = buyFrom;
        this.sellFrom = sellFrom;
        this.amount = amount;
        this.time = time;
    }

    toString() {
        return "Buy " + this.buyAmount + " " +this.currency + " in " + this.buyFrom + " and sell in " + this.sellFrom;
    }
}

// exporting looks different from Node.js but is almost as simple
export {Order};  