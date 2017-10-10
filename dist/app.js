/**
 * Created by Marco Radossi on 11/09/2017.
 */

'use strict';

var _settings = require('../src/config/settings');

var _picoes = require('picoes');

var _bluebird = require('bluebird');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _exchange = require('../src/components/exchange');

var _pair_value = require('../src/components/pair_value');

var _order = require('../src/components/order');

var _new_order = require('../src/components/new_order');

var _long_position = require('../src/components/long_position');

var _short_position = require('../src/components/short_position');

var _updating_state = require('../src/components/updating_state');

var _ready_state = require('../src/components/ready_state');

var _exchange_get_coins_values = require('../src/systems/exchange_get_coins_values');

var _evaluate_new_orders = require('../src/systems/evaluate_new_orders');

var _show_coins_values = require('../src/systems/show_coins_values');

var _open_positions = require('../src/systems/open_positions');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var world = new _picoes.World();

world.component('exchange', _exchange.ExchangeComponent);
world.component('pairValue', _pair_value.PairValueComponent);
world.component('order', _order.OrderComponent);
world.component('newOrder', _new_order.NewOrderComponent);
world.component('longPosition', _long_position.LongPositionComponent);
world.component('shortPosition', _short_position.ShortPositionComponent);
world.component('readyState', _ready_state.ReadyStateComponent);
world.component('updatingState', _updating_state.UpdatingStateComponent);

world.system(['pairValue', 'readyState'], _show_coins_values.ShowCoinsValuesSystem);
world.system(['pairValue', 'readyState'], _evaluate_new_orders.EvaluateNewOrdersSystem);
world.system(['order', 'newOrder'], _open_positions.OpenPositionsSystem);
world.system(['exchange'], _exchange_get_coins_values.ExchangeGetCoinsValuesSystem);

createExchangesEntities(_settings.markets);
createCoinsEntities(_settings.markets);

console.log('Inizio ore', new Date().toISOString());

world.initialize(world, _request2.default);

setInterval(function () {
    process.stdout.write(".");
    world.run();
}, 1000);

// TODO: move this into initialize method of a new system
function createExchangesEntities(markets) {
    // console.log('markets',markets)
    for (var idx in markets) {

        console.log('started', markets[idx].marketName, 'gateway');

        world.entity().set('exchange', {
            name: markets[idx].marketName,
            lastPriceUrl: markets[idx].URL,
            lastPriceFunction: markets[idx].lastPrice,
            bidPriceFunction: null,
            askPriceFunction: null
        }).set(markets[idx].marketName);
    }
}

// TODO: move this into initialize method of a new system
function createCoinsEntities(markets) {
    // console.log('markets',markets)
    for (var idx in markets) {
        var coin = world.entity().set('pairValue', {
            mainCoin: 'ETH',
            baseCoin: 'BTC',
            value: null,
            exchange: null
        }).set('updatingState').set(markets[idx].marketName);
    }
}