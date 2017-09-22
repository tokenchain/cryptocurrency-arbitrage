// a Order class using ES6 class syntax
class Position {  
    constructor(shortLong, pair, price, amount, leverage, exchange, time) {

        if (['short', 'long'].indexOf(shortLong)<0) {
            return false;
        }

        this.id = pair + '-' + exchange;
        this.shortLong = shortLong;
        this.pair = pair;
        this.price = price;
        this.amount = amount;
        this.exchange = exchange;
        this.time = time;
    }

    toString() {
        return this.shortLong+" " + this.amount + " " +this.pair + " in " + this.exchange;
    }
}

// exporting looks different from Node.js but is almost as simple
export {Position};  