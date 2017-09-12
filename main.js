/**
 * Created by Manu Masson on 6/27/2017.
 *
 */

'use strict';

console.log('Starting app...');

const request = require('request'), Promise = require("bluebird"); //request for pulling JSON from api. Bluebird for Promises.
const express = require('express');
const app = express(), 
    helmet = require('helmet'), 
    http = require('http').Server(app), 
    io = require('socket.io')(http); // For websocket server functionality

// create a file only file logger
const log = require('simple-node-logger')
                .createSimpleFileLogger('output/arb.log');

app.use(express.static('./frontend'));
app.use(helmet.hidePoweredBy({setTo: 'PHP/5.4.0'}));
// app.use(cors({credentials: false}));
const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


http.listen(port, function () {
    console.log('listening on', port);
});


require('./settings.js')(); //Includes settings file.

let coinNames = [];
let opportunities = [];

io.on('connection', function (socket) {
    socket.emit('coinsAndMarkets', [marketNames, coinNames]);
    socket.emit('results', results);
});

// coinPrices is an object with data on price differences between markets. = {BTC : {market1 : 2000, market2: 4000, p : 2}, } (P for percentage difference)
// results is a 2D array with coin name and percentage difference, sorted from low to high.
let coinPrices = {}, trades = { openOrders: {}, closeOrders: {}, positions: {}}, numberOfRequests = 0, results = []; // GLOBAL variables to get pushed to browser.

function getMarketData(options, coinPrices, callback) 
{ //GET JSON DATA
    return new Promise(function (resolve, reject) {
        request(options.URL, function (error, response, body) {
            try {
                let data = JSON.parse(body);
                //console.log("Success", options.marketName);
                
                if (options.marketName) {

                    let newCoinPrices;

                    newCoinPrices = options.lastPrice(data, coinPrices, options.toBTCURL);
                    numberOfRequests++;

                    if (numberOfRequests >= 1) { 
                        computePrices(coinPrices);
                    }
                    resolve(newCoinPrices);

                }
                else {
                    resolve(data);
                }

            } catch (error) {
                console.log("Error getting JSON response from", options.URL, error); //Throws error
                reject(error);
            }

        });


    });
}


function computePrices(data) 
{
    if (numberOfRequests >= 2) {
        results = [];
        for (let coin in data) {

            if (Object.keys(data[coin]).length > 1){
                if(coinNames.includes(coin) == false) coinNames.push(coin);

            let arr = [];
                for (let market in data[coin]) {
                    arr.push([data[coin][market], market]);
                }
                arr.sort(function (a, b) {
                    return a[0] - b[0];
                });

                for (let i = 0; i < arr.length; i++) {
                    for (let j = i + 1; j < arr.length; j++) {

                        var movement = [];
                        if (arr[i][0] / arr[j][0] > 1) {
                            movement = [
                                coin, 
                                arr[i][0] / arr[j][0], 
                                arr[i][0], arr[j][0], 
                                arr[i][1], arr[j][1] 
                            ]
                        } else {
                            movement = [
                                coin, 
                                arr[j][0] / arr[i][0], 
                                arr[j][0], arr[i][0], 
                                arr[j][1], arr[i][1]
                            ]                            
                        }
                        results.push(movement);
                    }
                }

            }
        }
        results.sort(function (a, b) {
            return a[1] - b[1];
        });

        io.emit('results', results);
    }
}


function prepareNewOrders(results, trades, threshold) 
{
    // console.log(results)

    // console.log('trades in prepareNewOrders',trades);

    results = results.filter(function(value, index, arr) {
        return value[1] >= threshold
    });

    console.log('new orders count with threshold ', threshold, ': ', Object.keys(results).length)
    
    // gets only "good" values to start an arb. with
    if (Object.keys(results).length > 0) {

        for (var idx in results) {
            let fee  = ( 0.002 + 0.002 )
            let key = results[idx][0]+'-'+results[idx][5]+'-'+results[idx][4]
            let diffValue = results[idx][2] - results[idx][3]
            let diffPerc = threshold - 1

            let data = {
                'buy': {
                    'price': results[idx][3],
                    'exch': results[idx][5]
                },
                'sell': {
                    'price': results[idx][2],
                    'exch': results[idx][4]
                },
                'fee': {
                    'exchBuy': 0.002,
                    'exchSell': 0.002
                },
                'earning': {
                        'value': (diffValue * diffPerc).toFixed(8),
                        'perc': diffPerc.toFixed(3) + '%'
                },
                'fee': fee,
                'profit': {
                    'value': (diffValue * ( diffPerc - fee )).toFixed(8),
                    'perc': (diffPerc - fee).toFixed(3) + '%'
                }
            }

            if (Object.keys(trades.positions).indexOf(key) < 0) {
                trades.openOrders[key] = data;
            }
        }   
        console.log('prepareNewOrders orders', trades.openOrders)
    }

}


function prepareClosingOrders(results, trades, threshold) 
{
    results = results.filter(function(value, index, arr) {
        return value[1] < threshold
    });

    // gets only "good" values to start an arb. with
    if (Object.keys(results).length > 0) {
        
        for (var idx in results) {
            let key = results[idx][0]+'-'+results[idx][5]+'-'+results[idx][4]
        
            if (Object.keys(trades.positions).indexOf(key) >= 0) {

                console.log('CLOSED ARBITRAGE ORDER', key)
                log.info('CLOSED ARBITRAGE ORDER', trades.positions[idx])

                // ORDER CLOSE
                trades.closeOrders[key] = trades.positions[idx]
            }
        }
    }

    console.log('prepareClosingOrders orders', trades.closeOrders)
}


function submitNewOrders(trades) 
{
    console.log('submitNewOrders orders', trades.openOrders)
    
    if (Object.keys(trades.openOrders).length > 0) {
        console.log('orders in submitNewOrders',trades.openOrders)
        
        let keys = Object.keys(trades.openOrders)
        
        for (let idx of keys) {
            // launches the order creating a position
            trades.positions[idx] = trades.openOrders[idx]

            log.info('OPEN ARB: ',trades.openOrders[idx])

            delete trades.openOrders[idx]
        }
    }    
}


function closePositions(trades) 
{
    console.log('closePositions orders', trades.closeOrders)
    
    if (Object.keys(trades.openOrders).length > 0) {
        console.log('orders in closePositions',trades.closeOrders)
        
        let keys = Object.keys(trades.closeOrders)
        
        for (let idx of keys) {
            // CLOSE ARB POSITIONS: HERE WE GOT MONEYS!!!
            console.log('CLOSE ARB: ',idx)
            log.info('CLOSE ARB: ',trades.positions[idx])

            delete trades.positions[idx]
            delete trades.closeOrders[idx]
        }
    }
}


function logSituation(trades) 
{
    if (!trades) return;

    console.log('-----------------')
    console.log('open orders', trades.openOrders)
    console.log('--------')
    console.log('close orders', trades.closeOrders)
    console.log('--------')
    console.log('positions', trades.positions)
    console.log('-----------------')
}


(async function main() {
    let arrayOfRequests = [];

    for (let i = 0; i < markets.length; i++) {
        arrayOfRequests.push(getMarketData(markets[i], coinPrices));
    }

    // process.stdout.write(".");

    await Promise.all(arrayOfRequests.map(p => p.catch(e => e)))
    
        .then( results => computePrices(coinPrices) )

        .then( prepareClosingOrders(results, trades, 1.001) )
        
        .then( closePositions(trades) )

        .then( prepareNewOrders(results, trades, 1.004) )

        .then( submitNewOrders(trades) )

        .then( logSituation(trades) )

        .catch(e => console.log(e));

    setTimeout(main, 1000);
})();
