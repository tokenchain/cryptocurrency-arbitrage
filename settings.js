/**
 * Created by hesk on 2017/12/13.
 */


const ccxt = require('ccxt');
module.exports = {
    exchanges: function () {
        return [
            new ccxt.kraken({verbose: false}),
            new ccxt.bittrex({verbose: false}),
            new ccxt.bleutrade({verbose: false}),
            new ccxt.bl3p({verbose: false}),
            new ccxt.allcoin({verbose: false}),
            new ccxt.binance({verbose: false}),
            new ccxt.bit2c({verbose: false}),
            new ccxt.bitbay({verbose: false}),
            new ccxt.bitcoincoid({verbose: false}),
            new ccxt.bitlish({verbose: false}),
            new ccxt.bitmarket({verbose: false}),
            new ccxt.bitso({verbose: false}),
            new ccxt.btcbox({verbose: false}),
            new ccxt.btcchina({verbose: false}),
            new ccxt.btcexchange({verbose: false}),
            new ccxt.btcmarkets({verbose: false}),
            new ccxt.btctradeua({verbose: false}),
            new ccxt.btcturk({verbose: false}),
            new ccxt.btcx({verbose: false}),
            new ccxt.bter({verbose: false}),
            new ccxt.bxinth({verbose: false}),
            new ccxt.ccex({verbose: false}),
            new ccxt.cex({verbose: false}),
            new ccxt.chbtc({verbose: false}),
            new ccxt.chilebit({verbose: false}),
            new ccxt.coincheck({verbose: false}),
            new ccxt.coinfloor({verbose: false}),
            new ccxt.foxbit({verbose: false}),
            new ccxt.gatecoin({verbose: false}),
            new ccxt.gdax({verbose: false}),
            new ccxt.gateio({verbose: false}),
            new ccxt.gemini({verbose: false}),
            new ccxt.getbtc({verbose: false}),
            new ccxt.huobipro({verbose: false}),
            new ccxt.itbit({verbose: false}),
            new ccxt.kucoin({verbose: false}),
            new ccxt.kuna({verbose: false}),
            new ccxt.lakebtc({verbose: false}),
            new ccxt.mixcoins({verbose: false}),
            new ccxt.okex({verbose: false}),
            new ccxt.quoine({verbose: false}),
            new ccxt.yunbi({verbose: false}),
            new ccxt.zb({verbose: false}),
            new ccxt.poloniex({verbose: false}),
            new ccxt.cryptopia({verbose: false}),
            new ccxt.anxpro({verbose: false}),
            new ccxt.bithumb({verbose: false}),
            new ccxt.bitflyer({verbose: false}),
            new ccxt.tidex({verbose: false}),
            new ccxt.bitmex({verbose: false}),
            new ccxt.bitstamp({verbose: false}),
            new ccxt.cex({verbose: false}),
            new ccxt.zaif({verbose: false}),
            new ccxt.vbtc({verbose: false}),
            new ccxt.exmo({verbose: false}),
            new ccxt.southxchange({verbose: false}),
            new ccxt.urdubit({verbose: false}),
            new ccxt.vaultoro({verbose: false}),
            new ccxt.therock({verbose: false}),
            new ccxt.bitfinex2({verbose: false})
        ];

    }
}
;