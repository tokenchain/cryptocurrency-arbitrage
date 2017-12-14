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
const io_server = http.createServer(app.callback());
let options = {};
const io7server = new IO({
    namespace: '/'
});
app.use(staticServe('./frontend'));
const port = process.env.PORT || 8002;
const host = 'localhost';
app.use(koahelmet());
io7server.start(io_server, options);
io_server.listen(port, host, function () {
    console.log('Trading Machine is now ONLINE. listening on', port);
    //  debug('server listen on: http://' + host + ':' + port);
});
io7server.on('error', function (error) {
    console.log(error);
});
// coin_prices is an object with data on price differences between markets. = {BTC : {market1 : 2000, market2: 4000, p : 2}, } (P for percentage difference)
// results is a 2D array with coin name and percentage difference, sorted from low to high.
let coinNames = [], coin_prices = {}, numberOfRequests = 0, results = [], global_socket; // GLOBAL variables to get pushed to browser.
const list_ex = settings.exchanges().map(ex => ex.id);
io7server.on('connect', async (ctx) => {
    const socket = ctx.socket;
    global_socket = socket;
    console.log('someone connect: %s', ctx.id);
    socket.emit('coinsAndMarkets', [list_ex, coinNames]);
    socket.emit('results', results);
    socket.on('disconnect', () => console.log("===> disconnected"));
    socket.on('reconnect_client', () => {
        console.log("===> back online server");
    });
});
async function getMarketData(exchange_obj, coin_prices) {
    await exchange_obj.loadMarkets();
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
                if (coinNames.includes(coin) === false) coinNames.push(coin);
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
        //console.log('return data market --> reuslts emits');
        if (global_socket != undefined) {
            global_socket.emit('results', results);
        }
    }
}

(async function main() {
    let arrayOfRequests = [];
    for (let ex of settings.exchanges()) {
        arrayOfRequests.push(getMarketData(ex, coin_prices));
    }
    console.log("======> new ===>", numberOfRequests);
    arrayOfRequests.map(e => e.catch(e => e));
    setTimeout(main, 10000);
})();

