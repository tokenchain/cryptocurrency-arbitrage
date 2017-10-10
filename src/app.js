/**
 * Created by Marco Radossi on 11/09/2017.
 */

'use strict';

import {markets} from '../src/config/settings'

import {World} from 'picoes'
import {Promise} from 'bluebird'
import request from 'request'

import {ExchangeComponent} from '../src/components/exchange'
import {PairValueComponent} from '../src/components/pair_value'
import {OrderComponent} from '../src/components/order'
import {NewOrderComponent} from '../src/components/new_order'
import {LongPositionComponent} from '../src/components/long_position'
import {ShortPositionComponent} from '../src/components/short_position'
import {UpdatingStateComponent} from '../src/components/updating_state'
import {ReadyStateComponent} from '../src/components/ready_state'

import {ExchangeGetCoinsValuesSystem} from '../src/systems/exchange_get_coins_values'
import {EvaluateNewOrdersSystem} from '../src/systems/evaluate_new_orders'
import {ShowCoinsValuesSystem} from '../src/systems/show_coins_values'
import {OpenPositionsSystem} from '../src/systems/open_positions'




let world = new World()

world.component('exchange', ExchangeComponent )
world.component('pairValue', PairValueComponent )
world.component('order', OrderComponent )
world.component('newOrder', NewOrderComponent )
world.component('longPosition', LongPositionComponent )
world.component('shortPosition', ShortPositionComponent )
world.component('readyState', ReadyStateComponent )
world.component('updatingState', UpdatingStateComponent )

world.system(['pairValue','readyState'], ShowCoinsValuesSystem)
world.system(['pairValue','readyState'], EvaluateNewOrdersSystem)
world.system(['order','newOrder'], OpenPositionsSystem)
world.system(['exchange'], ExchangeGetCoinsValuesSystem)

createExchangesEntities(markets)
createCoinsEntities(markets)

console.log('Inizio ore', new Date().toISOString())

world.initialize(world, request)

setInterval(function() { 
    process.stdout.write(".");    
    world.run() 
}, 1000)


// TODO: move this into initialize method of a new system
function createExchangesEntities(markets)
{
    // console.log('markets',markets)
    for (let idx in markets) {
        
        console.log('started',markets[idx].marketName,'gateway')

        world.entity()
            .set('exchange', { 
                name: markets[idx].marketName, 
                lastPriceUrl: markets[idx].URL,
                lastPriceFunction: markets[idx].lastPrice, 
                bidPriceFunction: null, 
                askPriceFunction: null,  
            })
            .set(markets[idx].marketName)
            ;
    }
}


// TODO: move this into initialize method of a new system
function createCoinsEntities(markets)
{
    // console.log('markets',markets)
    for (let idx in markets) {
        let coin = world.entity() 
            .set('pairValue', {
                mainCoin: 'ETH',
                baseCoin: 'BTC',
                value: null,
                exchange: null
            })
            .set('updatingState')
            .set(markets[idx].marketName)
    }
}
