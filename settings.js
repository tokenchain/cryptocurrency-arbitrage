/**
 * Created by hesk on 2017/12/13.
 */
/*
 import ccxt from 'ccxt'

 export default class {
 exchanges() {
 return [
 new ccxt.kraken({verbose: true}),
 new ccxt.bittrex({verbose: true}),
 new ccxt.btc38({verbose: true}),
 new ccxt.jubi({verbose: true}),
 new ccxt.poloniex({verbose: true}),
 new ccxt.cryptopia({verbose: true}),
 new ccxt.anxpro({verbose: true}),
 new ccxt.bithumb({verbose: true}),
 new ccxt.bitflyer({verbose: true}),
 new ccxt.tidex({verbose: true}),
 new ccxt.bitmex({verbose: true}),
 new ccxt.bitstamp({verbose: true}),
 new ccxt.cex({verbose: true}),
 new ccxt.exmo({verbose: true}),
 new ccxt.bitfinex2({verbose: true})
 ];
 }
 }
 */

const ccxt = require('ccxt');
module.exports = {
    exchanges: function () {
        return [
            new ccxt.kraken({verbose: false}),
            new ccxt.bittrex({verbose: false}),
            new ccxt.jubi({verbose: false}),
            new ccxt.poloniex({verbose: false}),
            new ccxt.cryptopia({verbose: false}),
            new ccxt.anxpro({verbose: false}),
            new ccxt.bithumb({verbose: false}),
            new ccxt.bitflyer({verbose: false}),
            new ccxt.tidex({verbose: false}),
            new ccxt.bitmex({verbose: false}),
            new ccxt.bitstamp({verbose: false}),
            new ccxt.cex({verbose: false}),
            new ccxt.exmo({verbose: false}),
            new ccxt.bitfinex2({verbose: false})
        ];

    }
}
;