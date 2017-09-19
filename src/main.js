/**
 * Created by Marco Radossi on 11/10/2017.
 *
 */

'use strict';

const path = require('path');
const request = require('request'), Promise = require("bluebird"); //request for pulling JSON from api. Bluebird for Promises.
const express = require('express');
const app = express(), 
    helmet = require('helmet'), 
    http = require('http').Server(app), 
    io = require('socket.io')(http); // For websocket server functionality
const time = require('time');
const clui = require('clui'),
    clc = require('cli-color'),
    LineBuffer = clui.LineBuffer,
    Line = clui.Line
    ;

// create a file only file logger
const log = require('simple-node-logger').createSimpleFileLogger('output/arb.log');


log.info('Starting app...');

app.use(express.static('./frontend'));
app.use(helmet.hidePoweredBy({setTo: 'PHP/5.4.0'}));
// app.use(cors({credentials: false}));
const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


http.listen(port, function () {
    log.info('listening on', port);
});


require('./config/settings.js')(); //Includes settings file.

let coinNames = [];
let opportunities = [];

io.on('connection', function (socket) {
    socket.emit('coinsAndMarkets', [marketNames, coinNames]);
    socket.emit('results', results);
});

// coinPrices is an object with data on price differences between markets. = {BTC : {market1 : 2000, market2: 4000, p : 2}, } (P for percentage difference)
// results is a 2D array with coin name and percentage difference, sorted from low to high.
let coinPrices = {}, trades = { openOrders: {}, closeOrders: {}, positions: {}, profit: 0}, numberOfRequests = 0, results = []; // GLOBAL variables to get pushed to browser.

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
                log.info("Error getting JSON response from", options.URL, error); //Throws error
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


function prepareOpeningOrders(results, trades, threshold) 
{
    results = results.filter(function(value, index, arr) {
        return value[1] >= threshold
    });

    // gets only "good" values to start an arb. with
    if (Object.keys(results).length > 0) {

        for (var idx in results) {
            let feePerc1  = 0.0025
            let feePerc2  = 0.0025
            let feePerc  = ( feePerc1 + feePerc2 )
            let key = results[idx][0]+'-'+results[idx][5]+'-'+results[idx][4]
            let diffValue = results[idx][2] - results[idx][3]
            let diffPerc = threshold - 1
            let fee1 = results[idx][2] * feePerc1
            let fee2 = results[idx][3] * feePerc2

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
                    'exchBuy': feePerc1 * 100,
                    'exchSell': feePerc2 * 100
                },
                'earning': {
                        'value': diffValue.toFixed(8),
                        'perc': diffPerc.toFixed(3) + '%'
                },
                'fee': feePerc,
                'profit': {
                    'value': (diffValue - ( fee1 + fee2 )).toFixed(8),
                    'perc': (diffPerc - feePerc).toFixed(3) + '%'
                }
            }

            if (Object.keys(trades.positions).indexOf(key) < 0) {
                trades.openOrders[key] = data;
            }
        }   
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

                log.info('CLOSED ARBITRAGE ORDER', trades.positions[key])

                // ORDER CLOSE
                trades.closeOrders[key] = trades.positions[key]
            }
        }
    }

}


function openPositions(trades) 
{
    if (Object.keys(trades.openOrders).length > 0) {
            
        let keys = Object.keys(trades.openOrders)
        
        for (let idx of keys) {
            // launches the order creating a position
            trades.positions[idx] = trades.openOrders[idx]

            log.info('OPEN ARB: ', idx, ' - ', trades.openOrders[idx])

            delete trades.openOrders[idx]
        }
    }    
}


function closePositions(trades) 
{
    
    if (Object.keys(trades.closeOrders).length > 0) {
            
        let keys = Object.keys(trades.closeOrders)
        
        for (let idx of keys) {
            // CLOSE ARB POSITIONS: HERE WE GOT MONEYS!!!
            log.info('CLOSE ARB: ', idx, ' - ', trades.positions[idx], " with profit ",trades.positions[idx].profit.value)

            trades.profit += Number(trades.positions[idx].profit.value)
            delete trades.positions[idx]
            delete trades.closeOrders[idx]
        }
    }
}


function logSituation(trades) 
{
    if (!trades) return;
    
    var now = new time.Date();
    now.setTimezone('Europe/Rome')
    
    var outputBuffer = new LineBuffer({
        x: 0,
        y: 0,
        width: 'console',
        height: 'console'
    });
    
    new Line(outputBuffer)
        .column('ARBiter ['+now.toLocaleTimeString()+']', 20, [clc.green])
        .column('Profit: ', 10, [clc.green])
        .column((trades.profit).toFixed(8)+' BTC', 20, [clc.green])
        .fill()
        .store();

    new Line(outputBuffer)
        .fill()
        .store();

    new Line(outputBuffer)
        .padding(2)
        .column('#', 4, [clc.red])
        .column('Broker', 20, [clc.green])
        .column('Price', 16, [clc.green])
        .column('State', 8, [clc.green])
        .fill()
        .store();
    
    if (coinPrices['ETH']) {
        let keys = Object.keys(coinPrices['ETH'])
        
        for (let idx in keys) {
            
            let exchange = keys[idx]
            let price = ''+coinPrices['ETH'][exchange]
            new Line(outputBuffer)
                .padding(2)
                .column(idx, 4)
                .column(exchange, 20)
                .column(price, 16)
                .column('ok', 8)
                .fill()
                .store();
        }
    }

    new Line(outputBuffer)
        .fill()
        .store();

    if (trades.positions) {
        new Line(outputBuffer)
            .column('Open Positions', 20, [clc.green])
            .fill()
            .store();

        new Line(outputBuffer)
            .column('#', 4, [clc.red])
            .column('Action', 8, [clc.green])
            .column('Broker', 20, [clc.green])
            .column('Price', 16, [clc.green])
            .column('Fee', 6, [clc.green])
            .fill()
            .store();
            
        let idx = 0
        for (let coin in trades.positions) {
            let position = trades.positions[coin]

            new Line(outputBuffer)
                .column(''+idx, 4)
                .column('BUY', 8)
                .column(position.buy.exch, 20)
                .column(''+position.buy.price, 16)
                .column('0.25%', 6)
                .fill()
                .store();
            new Line(outputBuffer)
                .column(''+idx, 4)
                .column('SELL', 8)
                .column(position.sell.exch, 20)
                .column(''+position.sell.price, 16)
                .column('0.25%', 6)
                .fill()
                .store();
            new Line(outputBuffer)
                .column(''+idx, 4)
                .column('GAIN', 8)
                .column('', 20)
                .column(''+(position.sell.price - position.buy.price).toFixed(8), 16)
                .column(''+(position.sell.price/position.buy.price - 1).toFixed(2)+'%', 6)
                .fill()
                .store();
            new Line(outputBuffer)
                .fill()
                .store();
        
        
            idx+=1
        }        
    }
        
    new Line(outputBuffer)
        .fill()
        .store();

    new Line(outputBuffer)
        .column('Dimensioni:', 16)
        .column(''+outputBuffer.width() + 'x' + outputBuffer.height(), 10)
        .fill()
        .store();

    //outputBuffer.fill();
    outputBuffer.output();
    
    // console.log(trades)
}


(async function main() {
    let arrayOfRequests = [];

    for (let i = 0; i < markets.length; i++) {
        arrayOfRequests.push(getMarketData(markets[i], coinPrices));
    }

        
    // process.stdout.write(".");

    await Promise.all(arrayOfRequests.map(p => p.catch(e => e)))
    
        .then( results => computePrices(coinPrices) )

        .then( prepareClosingOrders(results, trades, 1.0005) )
        
        .then( closePositions(trades) )

        .then( prepareOpeningOrders(results, trades, 1.006) )

        .then( openPositions(trades) )

        .then( logSituation(trades) )

        .catch(e => console.log(e));

    setTimeout(main, 2000);
})();
