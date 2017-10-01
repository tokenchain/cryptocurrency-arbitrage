/**
 * Created by Marco Radossi on 11/10/2017.
 */

'use strict';

var _picoes = require('picoes');

var _bluebird = require('bluebird');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _exchange = require('../src/components/exchange');

var _pair_value = require('../src/components/pair_value');

var _updating_state = require('../src/components/updating_state');

var _ready_state = require('../src/components/ready_state');

var _exchange_get_coins_values = require('../src/systems/exchange_get_coins_values');

var _show_coins_values = require('../src/systems/show_coins_values');

var _settings = require('../src/config/settings');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var world = new _picoes.World();

world.component('exchange', _exchange.ExchangeComponent);
world.component('pairValue', _pair_value.PairValueComponent);
world.component('readyState', _ready_state.ReadyStateComponent);
world.component('updatingState', _updating_state.UpdatingStateComponent);

world.system(['pairValue', 'readyState'], _show_coins_values.ShowCoinsValuesSystem);
world.system(['exchange'], _exchange_get_coins_values.ExchangeGetCoinsValuesSystem);

createExchangesEntities(_settings.markets);
createCoinsEntities(_settings.markets);

world.initialize(world, _request2.default);

setInterval(function () {
    console.log('.');
    world.run();
}, 1000);

// TODO: move this into initialize method of a new system
function createExchangesEntities(markets) {
    // console.log('markets',markets)
    for (var idx in markets) {

        world.entity().set('exchange', {
            name: markets[idx].marketName,
            lastPriceUrl: markets[idx].URL,
            lastPriceFunction: markets[idx].lastPrice,
            bidPriceFunction: null,
            askPriceFunction: null
        });
    }
}

// TODO: move this into initialize method of a new system
function createCoinsEntities(markets) {
    // console.log('markets',markets)
    for (var idx in markets) {
        var coin = world.entity().set('pairValue', {
            mainCoin: 'ETH',
            baseCoin: 'BTC',
            value: null
        }).set('updatingState').set(markets[idx].marketName);
    }
}