/**
 * Created by hesk on 2017/12/13.
 */


'use strict';
console.log('Starting app...');
const debug = require('debug')('koa-socket.io:example');
const staticServe = require('koa-static');
const Koa = require('koa');
const http = require('http');
const koahelmet = require('koa-helmet');
const IO = require('koa-socket.io');
const settings = require('./settings');
const app = new Koa();
const server = http.createServer(app.callback());
let options = {
    /* socket.io options */
};
const io = new IO({
    namespace: '/'
});
//const io = require('socket.io')(server);
app.use(staticServe('./frontend'));
const port = process.env.PORT || 8001;
const host = 'localhost';
app.use(koahelmet());
//app.listen(port, function () {
//    console.log('Trading Machine is now ONLINE. listening on', port);
//});
io.start(server, options);
server.listen(port, host, function () {
    console.log('Trading Machine is now ONLINE. listening on', port);
    debug('server listen on: http://' + host + ':' + port);
});
// coin_prices is an object with data on price differences between markets. = {BTC : {market1 : 2000, market2: 4000, p : 2}, } (P for percentage difference)
// results is a 2D array with coin name and percentage difference, sorted from low to high.
let coinNames = [], coin_prices = {}, numberOfRequests = 0, results = []; // GLOBAL variables to get pushed to browser.
io.on('connect', async (ctx) => {
    const socket = ctx.socket;
    //   let coinNamesList = [];
    let arr_list = settings.exchanges().map(ex => ex.id);
    socket.emit('coinsAndMarkets', [arr_list, coinNames]);
    socket.emit('results', results);
    socket.on("disconnect", () => console.log("Client disconnected"));
});
async function getMarketData(exchange_obj, coin_prices) { //GET JSON DATA
    await exchange_obj.loadMarkets();
    //console.log(numberOfRequests);
    //console.log("for loop", exchange_obj);
    for (let tradingPair in exchange_obj.markets) {
        if (!tradingPair.includes("BTC"))continue;
        //console.log("for loop", coinName);
        let ticker = await exchange_obj.fetchTicker(tradingPair);
        // console.log("show coin name", coinNamePair);
        const pair = tradingPair.split("/");
        const coinName = pair[0] === 'BTC' ? pair[1] : pair[0];
        if (!coin_prices[coinName]) coin_prices[coinName] = {};
        coin_prices[coinName][exchange_obj.id] = ticker['last'];
        //console.log("for_loop", exchange_obj.id);
        //console.log("num_request", numberOfRequests);
        numberOfRequests++;
        if (numberOfRequests >= 1) computePrices(coin_prices);
    }
}
function computePrices(data) {
    if (numberOfRequests >= 2) {
        results = [];
        for (let coin in data) {
            if (Object.keys(data[coin]).length > 1) {
                if (coinNames.includes(coin) == false) coinNames.push(coin);
                let arr = [];
                for (let market in data[coin]) {
                    arr.push([data[coin][market], market]);
                }
                arr.sort(function (a, b) {
                    return a[0] - b[0];
                });
                for (let i = 0; i < arr.length; i++) {
                    for (let j = i + 1; j < arr.length; j++) {
                        results.push(
                            [
                                coin,
                                arr[i][0] / arr[j][0],
                                arr[i][0], arr[j][0],
                                arr[i][1], arr[j][1]
                            ],
                            [
                                coin,
                                arr[j][0] / arr[i][0],
                                arr[j][0],
                                arr[i][0],
                                arr[j][1],
                                arr[i][1]
                            ]
                        );
                    }
                }

            }
        }
        results.sort(function (a, b) {
            return a[1] - b[1];
        });
        // console.log(results);
        io.emit('results', results);
    }
}

(async function main() {
    let arrayOfRequests = [];
    for (let ex of settings.exchanges()) {
        console.log("market", ex.id);
        arrayOfRequests.push(getMarketData(ex, coin_prices));
    }
    console.log("=========");
    arrayOfRequests.map(e => e.catch(e => e));
    setTimeout(main, 10000);
})();